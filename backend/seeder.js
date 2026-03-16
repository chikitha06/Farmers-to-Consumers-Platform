const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Notification = require('./models/Notification');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await Notification.deleteMany();
    await User.deleteMany();

   const admin = await User.create({ name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin', isVerified: true, isActive: true });

    await Product.insertMany([
      {
        name: 'Organic Tomatoes',
        image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400',
        description: 'Fresh organic tomatoes directly from our farm. Grown without pesticides.',
        category: 'Vegetables',
        price: 40,
        mrp: 60,
        countInStock: 100,
        seller: seller1,
        isVerified: true,
        rating: 4.5,
        numReviews: 12,
      },
      {
        name: 'Organic Tomatoes',
        image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400',
        description: 'Naturally grown tomatoes. Best quality guaranteed.',
        category: 'Vegetables',
        price: 35,
        mrp: 55,
        countInStock: 50,
        seller: seller2,
        isVerified: true,
        rating: 4.2,
        numReviews: 8,
      },
      {
        name: 'Fresh Spinach',
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
        description: 'Crisp, fresh spinach leaves packed with nutrients.',
        category: 'Vegetables',
        price: 25,
        mrp: 40,
        countInStock: 80,
        seller: seller1,
        isVerified: true,
        rating: 4.0,
        numReviews: 5,
      },
      {
        name: 'Alphonso Mangoes',
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400',
        description: 'Premium Alphonso mangoes from Ratnagiri. Naturally ripened.',
        category: 'Fruits',
        price: 150,
        mrp: 200,
        countInStock: 60,
        seller: seller2,
        isVerified: true,
        rating: 4.8,
        numReviews: 20,
      },
      {
        name: 'Fresh Bananas',
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
        description: 'Farm-fresh bananas. Ripened naturally on the plant.',
        category: 'Fruits',
        price: 30,
        mrp: 50,
        countInStock: 150,
        seller: seller1,
        isVerified: true,
        rating: 4.3,
        numReviews: 10,
      },
      {
        name: 'Basmati Rice',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        description: 'Premium long-grain basmati rice. Aromatic and fluffy.',
        category: 'Grains',
        price: 90,
        mrp: 120,
        countInStock: 200,
        seller: seller1,
        isVerified: true,
        rating: 4.6,
        numReviews: 15,
      },
      {
        name: 'Whole Wheat Flour',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
        description: 'Stone-ground whole wheat flour. High fiber, nutritious.',
        category: 'Grains',
        price: 45,
        mrp: 65,
        countInStock: 120,
        seller: seller2,
        isVerified: true,
        rating: 4.1,
        numReviews: 7,
      },
      {
        name: 'Fresh Cow Milk',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
        description: 'Fresh cow milk from grass-fed cows. No preservatives.',
        category: 'Dairy',
        price: 60,
        mrp: 80,
        countInStock: 50,
        seller: seller1,
        isVerified: true,
        rating: 4.7,
        numReviews: 18,
      },
      {
        name: 'Paneer',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
        description: 'Soft, fresh paneer made from full-fat cow milk.',
        category: 'Dairy',
        price: 120,
        mrp: 160,
        countInStock: 30,
        seller: seller2,
        isVerified: false, // Pending verification - shows up in admin panel
        rating: 0,
        numReviews: 0,
      },
    ]);

    console.log('\n✅ Data Imported Successfully!');
    console.log('\n📧 Test Accounts:');
    console.log('Admin:    admin@example.com  /  password123');
    console.log('Seller 1: ram@farmer.com     /  password123');
    console.log('Seller 2: shyam@farmer.com   /  password123');
    console.log('Customer: john@example.com   /  password123');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();