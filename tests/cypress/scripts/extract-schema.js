const swaggerJsDoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

console.log('Extracting Swagger schema JSON file...');

// Copy the swagger options from server.js
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
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
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
  apis: ['../../backend/server.js'] // Path to the API docs
};

try {
  // Generate the swagger docs
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  
  console.log('Successfully generated Swagger schema JSON');
  console.log(`Schema version: ${swaggerDocs.openapi}`);
  console.log(`API title: ${swaggerDocs.info.title}`);
  console.log(`API version: ${swaggerDocs.info.version}`);
  
  // Count the number of endpoints
  const paths = Object.keys(swaggerDocs.paths || {}).length;
  console.log(`Number of API endpoints: ${paths}`);
  
  // Save the schema to the testdata folder
  const outputPath = path.join(__dirname, '..', 'testdata', 'schema.json');
  fs.writeFileSync(outputPath, JSON.stringify(swaggerDocs, null, 2));
  console.log(`Saved schema to ${outputPath}`);
} catch (error) {
  console.error('Error generating Swagger schema JSON:', error.message);
  process.exit(1);
}