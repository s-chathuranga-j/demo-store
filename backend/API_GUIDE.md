# Demo E-Commerce API Guide

This guide provides instructions on how to set up and test the Demo E-Commerce API using Postman.

## Table of Contents

1. [API Overview](#api-overview)
2. [Setting Up the API](#setting-up-the-api)
3. [Authentication](#authentication)
4. [Testing with Postman](#testing-with-postman)
5. [API Endpoints](#api-endpoints)

## API Overview

The Demo E-Commerce API is a RESTful API built with Node.js, Express, and SQLite. It provides endpoints for:

- Product management
- Shopping cart operations
- Checkout process
- User authentication

## Setting Up the API

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation Steps

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/demo-store.git
   cd demo-store
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Set up the database:
   ```
   npx prisma migrate dev
   npm run prisma:seed
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

5. Access the Swagger documentation:
   ```
   http://localhost:3001/api-docs
   ```

## Authentication

The API uses JWT (JSON Web Token) for authentication. To access protected endpoints, you need to:

1. Register a new user or login with existing credentials
2. Include the JWT token in the Authorization header of your requests

### JWT Token Format

```
Authorization: Bearer <your_jwt_token>
```

### Demo Account

You can use the following demo account for testing:

- Email: user@example.com
- Password: password123

## Testing with Postman

### Setting Up Postman

1. Download and install [Postman](https://www.postman.com/downloads/)
2. Create a new Collection named "Demo E-Commerce API"

### Creating Environment Variables

1. Create a new Environment in Postman
2. Add the following variables:
   - `baseUrl`: http://localhost:3001
   - `token`: (leave empty initially)

### Authentication Flow

1. **Register a new user**:
   - Method: POST
   - URL: {{baseUrl}}/api/auth/register
   - Body (JSON):
     ```json
     {
       "email": "your.email@example.com",
       "password": "your_password",
       "name": "Your Name"
     }
     ```

2. **Login**:
   - Method: POST
   - URL: {{baseUrl}}/api/auth/login
   - Body (JSON):
     ```json
     {
       "email": "your.email@example.com",
       "password": "your_password"
     }
     ```

3. **Save the token**:
   - In the login response, you'll receive a token
   - Set the `token` environment variable with this value
   - Create a Pre-request Script for your collection:
     ```javascript
     pm.request.headers.add({
       key: 'Authorization',
       value: 'Bearer ' + pm.environment.get('token')
     });
     ```

## API Endpoints

### Products

- **Get all products**:
  - Method: GET
  - URL: {{baseUrl}}/api/products
  - Authentication: Not required

- **Get product by ID**:
  - Method: GET
  - URL: {{baseUrl}}/api/products/:id
  - Authentication: Not required

### Cart (Requires Authentication)

- **Get cart items**:
  - Method: GET
  - URL: {{baseUrl}}/api/cart
  - Authentication: Required

- **Add item to cart**:
  - Method: POST
  - URL: {{baseUrl}}/api/cart
  - Body (JSON):
    ```json
    {
      "productId": 1,
      "quantity": 2
    }
    ```
  - Authentication: Required

- **Remove item from cart**:
  - Method: DELETE
  - URL: {{baseUrl}}/api/cart/:productId
  - Authentication: Required

### Checkout (Requires Authentication)

- **Process checkout**:
  - Method: POST
  - URL: {{baseUrl}}/api/checkout
  - Authentication: Required

### Authentication

- **Register**:
  - Method: POST
  - URL: {{baseUrl}}/api/auth/register
  - Body (JSON):
    ```json
    {
      "email": "your.email@example.com",
      "password": "your_password",
      "name": "Your Name"
    }
    ```
  - Authentication: Not required

- **Login**:
  - Method: POST
  - URL: {{baseUrl}}/api/auth/login
  - Body (JSON):
    ```json
    {
      "email": "your.email@example.com",
      "password": "your_password"
    }
    ```
  - Authentication: Not required

## Troubleshooting

### Common Issues

1. **401 Unauthorized Error**:
   - Make sure you're including the JWT token in the Authorization header
   - Check if your token has expired (tokens expire after 1 day)
   - Try logging in again to get a new token

2. **404 Not Found Error**:
   - Verify that you're using the correct endpoint URL
   - Check if the resource (e.g., product ID) exists

3. **500 Server Error**:
   - Check the server logs for more details
   - Ensure the database is properly set up and seeded