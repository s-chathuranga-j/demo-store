const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Demo E-Commerce API',
      version: '1.0.0',
      description: 'A simple e-commerce API for demo/testing purposes',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: 'Development server'
        }
      ]
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./server.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log('Swagger documentation generated');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
console.log('Static middleware configured for:', __dirname + '/public');

// Root route to provide basic info and links
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Demo E-Commerce API</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; }
          .link { display: inline-block; background-color: #4990e2; color: white; padding: 10px 20px; 
                 text-decoration: none; border-radius: 4px; font-weight: bold; margin: 10px 0; }
          .link:hover { background-color: #357abd; }
        </style>
      </head>
      <body>
        <h1>Demo E-Commerce API</h1>
        <p>Welcome to the Demo E-Commerce API server.</p>
        <p>Available resources:</p>
        <ul>
          <li><a href="/api-docs" class="link">API Documentation (Swagger UI)</a></li>
          <li><a href="/api-docs-fallback" class="link">API Documentation (Fallback Page)</a></li>
          <li><a href="/api-docs-json" class="link">Download API Schema (JSON)</a></li>
        </ul>
      </body>
    </html>
  `);
});

// Endpoint to download the Swagger schema as JSON
app.get('/api-docs-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=swagger-schema.json');
  res.send(swaggerDocs);
});

// Fallback route for API docs
app.get('/api-docs-fallback', (req, res) => {
  res.sendFile(__dirname + '/public/swagger-fallback.html');
});

// Setup Swagger UI with custom options to include download link
const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'list'
  },
  customCss: '.swagger-ui .topbar { display: flex; align-items: center; } .download-schema-link { display: block; margin: 10px 0; text-align: right; }',
  customSiteTitle: 'Demo E-Commerce API Documentation',
  customfavIcon: '',
  customJs: '/custom-swagger.js',
  // Add HTML to include a direct link to the schema
  customCssUrl: null,
  customfavIconUrl: null,
  htmlTitleText: 'API Documentation',
  customHeadContent: '<style>.download-schema-link { padding: 10px; background-color: #4990e2; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }</style>'
};

console.log('Custom JS path:', '/custom-swagger.js', '(absolute path:', __dirname + '/public/custom-swagger.js', ')');

console.log('Setting up Swagger UI at /api-docs with custom options');
try {
  // Use the standard setup method which is more reliable
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions));
  console.log('Swagger UI setup complete using standard method');
} catch (error) {
  console.error('Error setting up Swagger UI:', error);
  // Fallback if Swagger UI setup fails
  app.get('/api-docs', (req, res) => {
    res.redirect('/api-docs-fallback');
  });
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Product routes
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The product ID
 *                   name:
 *                     type: string
 *                     description: The product name
 *                   description:
 *                     type: string
 *                     description: The product description
 *                   price:
 *                     type: number
 *                     description: The product price
 *                   imageUrl:
 *                     type: string
 *                     description: URL to the product image
 *       500:
 *         description: Server error
 */
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Retrieve a specific product by its ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The product ID
 *                 name:
 *                   type: string
 *                   description: The product name
 *                 description:
 *                   type: string
 *                   description: The product description
 *                 price:
 *                   type: number
 *                   description: The product price
 *                 imageUrl:
 *                   type: string
 *                   description: URL to the product image
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Cart routes
/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart items
 *     description: Retrieve all items in the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The cart item ID
 *                   quantity:
 *                     type: integer
 *                     description: The quantity of the product
 *                   userId:
 *                     type: integer
 *                     description: The user ID
 *                   productId:
 *                     type: integer
 *                     description: The product ID
 *                   product:
 *                     type: object
 *                     description: The product details
 *       401:
 *         description: Unauthorized - JWT token is missing or invalid
 *       500:
 *         description: Server error
 */
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     description: Add a product to the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: The ID of the product to add to cart
 *               quantity:
 *                 type: integer
 *                 description: The quantity to add (defaults to 1)
 *                 default: 1
 *     responses:
 *       200:
 *         description: Updated cart item (if already in cart)
 *       201:
 *         description: New cart item created
 *       401:
 *         description: Unauthorized - JWT token is missing or invalid
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
app.post('/api/cart', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: req.user.id,
        productId: Number(productId),
      },
    });

    if (existingCartItem) {
      // Update quantity
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + (quantity || 1) },
        include: { product: true },
      });
      return res.json(updatedCartItem);
    }

    // Add new item to cart
    const cartItem = await prisma.cartItem.create({
      data: {
        userId: req.user.id,
        productId: Number(productId),
        quantity: quantity || 1,
      },
      include: { product: true },
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Remove a product from the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to remove from cart
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Item removed successfully
 *       401:
 *         description: Unauthorized - JWT token is missing or invalid
 *       404:
 *         description: Item not found in cart
 *       500:
 *         description: Server error
 */
app.delete('/api/cart/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        userId: req.user.id,
        productId: Number(productId),
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Checkout route
/**
 * @swagger
 * /api/checkout:
 *   post:
 *     summary: Process checkout
 *     description: Process the user's cart items into an order and clear the cart
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the checkout was successful
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 orderId:
 *                   type: integer
 *                   description: The ID of the created order
 *       400:
 *         description: Bad request - Cart is empty
 *       401:
 *         description: Unauthorized - JWT token is missing or invalid
 *       500:
 *         description: Server error
 */
app.post('/api/checkout', authenticateToken, async (req, res) => {
  try {
    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        status: 'completed',
        total,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id },
    });

    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully', 
      orderId: order.id 
    });
  } catch (error) {
    res.status(500).json({ error: 'Checkout failed' });
  }
});

// Auth routes
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account and return a JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *               name:
 *                 type: string
 *                 description: User's name (optional)
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user ID
 *                 email:
 *                   type: string
 *                   description: The user's email
 *                 name:
 *                   type: string
 *                   description: The user's name
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Bad request - User already exists
 *       500:
 *         description: Server error
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate a user and return a JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user ID
 *                 email:
 *                   type: string
 *                   description: The user's email
 *                 name:
 *                   type: string
 *                   description: The user's name
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       401:
 *         description: Unauthorized - Invalid credentials
 *       500:
 *         description: Server error
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
