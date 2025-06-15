# Demo E-Commerce Store

A simple e-commerce web application with a React frontend and Node.js/Express backend. This project is designed for demo/testing purposes, particularly for showcasing automated testing work.

## Features

### Frontend
- Home page with product listing
- Product detail page
- Shopping cart (add/remove functionality)
- Checkout page (simulated checkout)
- User login/register (JWT-based authentication)

### Backend API
- RESTful API endpoints for products, cart, checkout, and authentication
- SQLite database for data storage
- Prisma ORM for database management

## Tech Stack

- **Frontend**: React with React Router
- **Backend**: Node.js with Express
- **Database**: SQLite
- **ORM**: Prisma
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

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

4. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. In a separate terminal, start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Demo Account

You can use the following demo account to test the application:

- Email: user@example.com
- Password: password123

## API Documentation

### Swagger Documentation

The API includes Swagger documentation which can be accessed at:

```
http://localhost:3001/api-docs
```

This interactive documentation allows you to:
- View all available endpoints
- See request and response formats
- Test API endpoints directly from the browser

A complete Swagger schema JSON file for all API endpoints is available at:
```
tests/cypress/testdata/schema.json
```

This schema file can be used for API testing and validation in Cypress tests.

### API Guide

For detailed instructions on setting up and testing the API with Postman, see the [API Guide](backend/API_GUIDE.md).

### API Endpoints Summary

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/cart` - Add a product to cart
- `GET /api/cart` - Get cart items (requires authentication)
- `DELETE /api/cart/:productId` - Remove a product from cart (requires authentication)
- `POST /api/checkout` - Process checkout (requires authentication)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

## Project Structure

```
demo-store/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
├── tests/
│   ├── cypress/
│   │   ├── pages/
│   │   ├── scripts/
│   │   ├── testbase/
│   │   ├── testdata/
│   │   │   ├── testdata.json
│   │   │   └── schema.json
│   │   └── tests/
│   │       ├── api/
│   │       └── ui/
│   └── cypress.config.ts
└── README.md
```

## Testing

This application is designed to be easily testable with:
- UI testing with Cypress
- API testing with schema validation
- Cross-browser testing with BrowserStack

### Running Tests

#### Backend Tests
To test the database connection:
```
cd backend
node test.js
```

The backend includes a simple test script that verifies the database connection and retrieves a sample product to ensure everything is set up correctly.

#### Cypress Tests
To run Cypress tests:
```
cd tests
npx cypress open
```

For API testing, you can use the Swagger schema JSON file located at `tests/cypress/testdata/schema.json` for request and response validation. This schema contains definitions for all API endpoints and can be used to validate API responses against the expected schema.

## License

This project is licensed under the MIT License.
