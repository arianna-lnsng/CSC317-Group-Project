/**
 * Database Seeder
 * This script populates the database with initial data for development
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import models
const User = require('../../models/User');
const Title = require('../../models/Title');
const Rating = require('../../models/Rating');
const Review = require('../../models/Review');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ink_and_frame')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Make sure MongoDB is running!');
    process.exit(1);
  });

// Sample data
const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    watchlist: [],
    readingList: [],
    moviesWatched: 0,
    booksRead: 0
  },
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    watchlist: [],
    readingList: [],
    moviesWatched: 0,
    booksRead: 0
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'password123',
    watchlist: [],
    readingList: [],
    moviesWatched: 0,
    booksRead: 0
  }
];

const titles = [
  {
    name: 'The Shawshank Redemption',
    type: 'movie',
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
    genre: 'drama',
    releaseYear: 1994,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['prison', 'drama', 'classic']
  },
  {
    name: 'The Godfather',
    type: 'movie',
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    genre: 'crime',
    releaseYear: 1972,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['mafia', 'crime', 'drama', 'classic']
  },
  {
    name: 'To Kill a Mockingbird',
    type: 'book',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg',
    genre: 'fiction',
    releaseYear: 1960,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['race', 'justice', 'segregation', 'classic']
  },
  {
    name: '1984',
    type: 'book',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/1984first.jpg/330px-1984first.jpg',
    genre: 'dystopian',
    releaseYear: 1949,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['totalitarianism', 'surveillance', 'dystopia', 'government']
  },
  {
    name: 'Inception',
    type: 'movie',
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    genre: 'sci-fi',
    releaseYear: 2010,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['dreams', 'heist', 'sci-fi', 'action']
  },
  {
    name: 'Harry Potter and the Philosopher\'s Stone',
    type: 'book',
    imageUrl: 'https://m.media-amazon.com/images/I/81m1s4wIPML._AC_UF1000,1000_QL80_.jpg',
    genre: 'fantasy',
    releaseYear: 1997,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['magic', 'wizard', 'fantasy', 'adventure']
  },
  {
    name: 'Scream',
    type: 'movie',
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BMjA2NjU5MTg5OF5BMl5BanBnXkFtZTgwOTkyMzQxMDE@._V1_FMjpg_UX904_.jpg',
    genre: 'horror',
    releaseYear: 1996,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['horror', 'slasher', 'mystery', 'thriller', 'suspense']
  },
  {
    name: "Twilight",
    type: "movie",
    imageURL: "https://m.media-amazon.com/images/M/MV5BMTQ2NzUxMTAxN15BMl5BanBnXkFtZTcwMzEyMTIwMg@@._V1_QL75_UX285_CR0,0,285,422_.jpg",
    genre: "romantic fantasy",
    releaseYear: 2008,
    averageRating: 0,
    totalRatings: 0,
    keywords: ["vampire", "romance", "supernatural"]
  },
  {
    name: "The Grand Budapest Hotel",
    type: "movie",
    imageURL: "https://m.media-amazon.com/images/M/MV5BMzM5NjUxOTEyMl5BMl5BanBnXkFtZTgwNjEyMDM0MDE@._V1_QL75_UX380_CR0,0,380,562_.jpg",
    genre: "drama",
    releaseYear: 2014,
    averageRating: 0,
    totalRatings: 0,
    keywords: ["Wes Anderson", "mystery", "adventure", "comedy"],
  },
  {
    name: "Pulp Fiction",
    type: "movie",
    imageURL: "https://m.media-amazon.com/images/I/71c05lTE03L._AC_SY679_.jpg",
    genre: "crime",
    releaseYear: 1994,
    averageRating: 0,
    totalRatings: 0,
    keywords: ["crime", "hitmen", "Quentin Tarantino"]
  }
];

// Simple function to seed the database
async function seedDatabase() {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Title.deleteMany({});
    await Rating.deleteMany({});
    await Review.deleteMany({});

    // Insert users with simple password hashing
    console.log('Creating users...');
    const createdUsers = [];
    for (const user of users) {
      // Simple password hashing
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const newUser = new User({
        username: user.username,
        email: user.email,
        password: hashedPassword,
        watchlist: [],
        readingList: []
      });

      const savedUser = await newUser.save();
      createdUsers.push(savedUser);
    }

    // Insert titles
    console.log('Creating titles...');
    const createdTitles = [];
    for (const title of titles) {
      const newTitle = new Title(title);
      const savedTitle = await newTitle.save();
      createdTitles.push(savedTitle);
    }

    // Create some ratings
    console.log('Creating ratings...');
    for (let i = 0; i < 10; i++) {
      // Create 10 random ratings
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomTitle = createdTitles[Math.floor(Math.random() * createdTitles.length)];
      const randomRating = Math.floor(Math.random() * 5) + 1; // Random rating 1-5

      const rating = new Rating({
        userId: randomUser._id,
        titleId: randomTitle._id,
        rating: randomRating
      });

      await rating.save();
    }

    // Create some reviews
    console.log('Creating reviews...');
    for (let i = 0; i < 5; i++) {
      // Create 5 random reviews
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomTitle = createdTitles[Math.floor(Math.random() * createdTitles.length)];

      const review = new Review({
        titleId: randomTitle._id,
        userId: randomUser._id,
        reviewTitle: `Review of ${randomTitle.name}`,
        content: `This is a sample review for ${randomTitle.name}. It's a ${randomTitle.type} in the ${randomTitle.genre} genre.`,
        rating: Math.floor(Math.random() * 5) + 1 // Random rating 1-5
      });

      await review.save();
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Run the seed function
seedDatabase();
