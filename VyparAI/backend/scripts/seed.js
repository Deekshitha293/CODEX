import { connectDB } from '../src/config/db.js';
import { Product } from '../src/models/Product.js';

const run = async () => {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany([
    { name: 'Keyboard', price: 49.99, quantity: 25, description: 'Mechanical keyboard' },
    { name: 'Mouse', price: 19.99, quantity: 40, description: 'Wireless mouse' },
    { name: 'Monitor', price: 199.99, quantity: 8, description: '24 inch IPS monitor' },
  ]);
  console.log('Seed completed');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
