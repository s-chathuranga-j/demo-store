const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  // Create dummy products
  const products = [
    {
      name: 'Smartphone X',
      description: 'Latest smartphone with advanced features',
      price: 999.99,
      imageUrl: '/images/smartphone.svg',
    },
    {
      name: 'Laptop Pro',
      description: 'High-performance laptop for professionals',
      price: 1499.99,
      imageUrl: '/images/laptop.svg',
    },
    {
      name: 'Wireless Headphones',
      description: 'Premium noise-cancelling wireless headphones',
      price: 249.99,
      imageUrl: '/images/headphones.svg',
    },
    {
      name: 'Smart Watch',
      description: 'Fitness and health tracking smartwatch',
      price: 199.99,
      imageUrl: '/images/smartwatch.svg',
    },
    {
      name: 'Tablet Ultra',
      description: 'Lightweight tablet with stunning display',
      price: 599.99,
      imageUrl: '/images/tablet.svg',
    },
    {
      name: 'Wireless Earbuds',
      description: 'Compact wireless earbuds with great sound quality',
      price: 129.99,
      imageUrl: '/images/earbuds.svg',
    },
  ];

  // Get existing products
  const existingProducts = await prisma.product.findMany();

  // If no products exist, create them
  if (existingProducts.length === 0) {
    for (const product of products) {
      await prisma.product.create({
        data: product,
      });
    }
  } 
  // Otherwise, update existing products
  else {
    for (let i = 0; i < Math.min(existingProducts.length, products.length); i++) {
      await prisma.product.update({
        where: { id: existingProducts[i].id },
        data: { 
          name: products[i].name,
          description: products[i].description,
          price: products[i].price,
          imageUrl: products[i].imageUrl
        },
      });
    }
  }

  // Products are already created or updated using upsert above

  // Create a demo user if it doesn't exist
  const existingUser = await prisma.user.findUnique({
    where: { email: 'user@example.com' }
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        email: 'user@example.com',
        password: hashedPassword,
        name: 'Demo User',
      },
    });
  }

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
