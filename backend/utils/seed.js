const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const Product  = require('../models/Product');

dotenv.config();

const products = [
  {
    name: 'AeroStride Pro Running Shoe',
    description: 'Lightweight performance running shoe with responsive cushioning and breathable mesh upper.',
    price: 4999,
    category: 'Running',
    sizes: ['6', '7', '8', '9', '10', '11'],
    variants: ['Black', 'White', 'Navy'],
    stock: 50,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
    featured: true,
  },
  {
    name: 'FlexCore Training Shorts',
    description: 'Moisture-wicking training shorts with 4-way stretch fabric for maximum mobility.',
    price: 1499,
    category: 'Training',
    sizes: ['S', 'M', 'L', 'XL'],
    variants: ['Black', 'Grey', 'Navy'],
    stock: 80,
    images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=800'],
    featured: false,
  },
  {
    name: 'StrideX Performance Tee',
    description: 'Ultra-soft performance t-shirt with sweat-wicking technology for intense workouts.',
    price: 999,
    category: 'Training',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    variants: ['White', 'Black', 'Red'],
    stock: 120,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
    featured: true,
  },
  {
    name: 'CloudRun Elite Sneaker',
    description: 'Premium lifestyle sneaker with cloud-like cushioning for all-day comfort.',
    price: 6999,
    category: 'Lifestyle',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    variants: ['White', 'Black', 'Cream'],
    stock: 30,
    images: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800'],
    featured: true,
  },
  {
    name: 'PowerLift Gym Gloves',
    description: 'Durable gym gloves with wrist support and anti-slip grip for heavy lifting.',
    price: 799,
    category: 'Accessories',
    sizes: ['S', 'M', 'L'],
    variants: ['Black', 'Grey'],
    stock: 4,
    images: ['https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800'],
    featured: false,
  },
  {
    name: 'AeroMesh Sports Jacket',
    description: 'Lightweight windproof sports jacket with mesh lining for outdoor training.',
    price: 3499,
    category: 'Outerwear',
    sizes: ['S', 'M', 'L', 'XL'],
    variants: ['Black', 'Olive', 'Navy'],
    stock: 25,
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'],
    featured: false,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await Product.deleteMany();
    console.log('Cleared existing products');

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();