/**
 * MongoDB Connection Test
 * This script tests the connection to MongoDB and verifies that models are working properly
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const User = require('../models/User');
const Title = require('../models/Title');
const Rating = require('../models/Rating');
const Review = require('../models/Review');

console.log('Testing MongoDB connection...');
console.log(`Attempting to connect to: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/ink_and_frame'}`);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ink_and_frame')
  .then(async () => {
    console.log('✅ MongoDB connected successfully!');
    
    // Check if collections exist
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      
      console.log('\nAvailable collections:');
      console.log(collectionNames);
      
      // Check counts for each collection
      const userCount = await User.countDocuments();
      const titleCount = await Title.countDocuments();
      const ratingCount = await Rating.countDocuments();
      const reviewCount = await Review.countDocuments();
      
      console.log('\nCollection counts:');
      console.log(`- Users: ${userCount}`);
      console.log(`- Titles: ${titleCount}`);
      console.log(`- Ratings: ${ratingCount}`);
      console.log(`- Reviews: ${reviewCount}`);
      
      if (userCount === 0 && titleCount === 0) {
        console.log('\n⚠️ Database is empty. You may want to run the seed script:');
        console.log('node utils/seeders/seed.js');
      }
      
    } catch (err) {
      console.error('Error checking collections:', err);
    }
    
    // Close the connection
    mongoose.connection.close();
    console.log('\nConnection closed.');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
