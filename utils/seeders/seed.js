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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/AfterTheCredits')
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
    moviesWatched: 0
  },
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    watchlist: [],
    moviesWatched: 0
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'password123',
    watchlist: [],
    moviesWatched: 0
  }
];

const titles = [
  {
    name: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    duration: 142,
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
    genre: 'drama',
    releaseYear: 1994,
    averageRating: 4.9,
    totalRatings: 0,
    keywords: ['prison', 'drama', 'classic']
  },
  {
    name: 'The Godfather',
    director: 'Francis Ford Coppola',
    duration: 175,
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    genre: 'crime',
    releaseYear: 1972,
    averageRating: 4.9,
    totalRatings: 0,
    keywords: ['mafia', 'crime', 'drama', 'classic']
  },
  {
    name: 'Inception',
    director: 'Christopher Nolan',
    duration: 148,
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    genre: 'sci-fi',
    releaseYear: 2010,
    averageRating: 4.7,
    totalRatings: 0,
    keywords: ['dreams', 'heist', 'sci-fi', 'action']
  },
  {
    name: 'Scream',
    director: 'Wes Craven',
    duration: 111,
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BMjA2NjU5MTg5OF5BMl5BanBnXkFtZTgwOTkyMzQxMDE@._V1_FMjpg_UX904_.jpg',
    genre: 'horror',
    releaseYear: 1996,
    averageRating: 4.0,
    totalRatings: 0,
    keywords: ['horror', 'slasher', 'mystery', 'thriller', 'suspense']
  },
  {
    name: 'Twilight',
    director: 'Catherine Hardwicke',
    duration: 122,
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTQ2NzUxMTAxN15BMl5BanBnXkFtZTcwMzEyMTIwMg@@._V1_QL75_UX285_CR0,0,285,422_.jpg',
    genre: 'romantic fantasy',
    releaseYear: 2008,
    averageRating: 3.2,
    totalRatings: 0,
    keywords: ['vampire', 'romance', 'supernatural']
  },
  {
    name: 'The Grand Budapest Hotel',
    director: 'Wes Anderson',
    duration: 99,
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BMzM5NjUxOTEyMl5BMl5BanBnXkFtZTgwNjEyMDM0MDE@._V1_QL75_UX380_CR0,0,380,562_.jpg',
    genre: 'comedy',
    releaseYear: 2014,
    averageRating: 4.3,
    totalRatings: 0,
    keywords: ['Wes Anderson', 'mystery', 'adventure', 'comedy']
  },
  {
    name: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    duration: 154,
    imageUrl: 'https://m.media-amazon.com/images/I/71c05lTE03L._AC_SY679_.jpg',
    genre: 'crime',
    releaseYear: 1994,
    averageRating: 4.8,
    totalRatings: 0,
    keywords: ['crime', 'hitmen', 'Quentin Tarantino']
  },
  {
    name: 'Toy Story',
    director: 'John Lasseter',
    duration: 81,
    imageUrl: 'https://m.media-amazon.com/images/I/71Ev33kQt2L._AC_UF894,1000_QL80_.jpg',
    genre: 'animation',
    releaseYear: 1995,
    averageRating: 4.6,
    totalRatings: 0,
    keywords: ['animation', 'pixar', 'adventure', 'family']
  },
  {
    name: 'Jurassic Park',
    director: 'Steven Spielberg',
    duration: 127,
    imageUrl: 'https://m.media-amazon.com/images/I/91QBImIxqWL._AC_UF894,1000_QL80_.jpg',
    genre: 'adventure',
    releaseYear: 1993,
    averageRating: 4.5,
    totalRatings: 0,
    keywords: ['dinosaurs', 'adventure', 'spielberg']
  },
  {
    name: 'Forrest Gump',
    director: 'Robert Zemeckis',
    duration: 142,
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BNDYwNzVjMTItZmU5YS00YjQ5LTljYjgtMjY2NDVmYWMyNWFmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    genre: 'drama',
    releaseYear: 1994,
    averageRating: 4.7,
    totalRatings: 0,
    keywords: ['drama', 'oscar', 'classic']
  },
  {
    name: 'The Matrix',
    director: 'Lana Wachowski, Lilly Wachowski',
    duration: 136,
    imageUrl: 'https://m.media-amazon.com/images/I/613ypTLZHsL._AC_UF894,1000_QL80_.jpg',
    genre: 'sci-fi',
    releaseYear: 1999,
    averageRating: 4.7,
    totalRatings: 0,
    keywords: ['sci-fi', 'action', 'matrix']
  },
  {
    name: 'The Dark Knight',
    director: 'Christopher Nolan',
    duration: 152,
    imageUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    genre: 'action',
    releaseYear: 2008,
    averageRating: 4.8,
    totalRatings: 0,
    keywords: ['batman', 'joker', 'dc', 'action']
  },
  {
    name: 'Interstellar',
    director: 'Christopher Nolan',
    duration: 169,
    imageUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    genre: 'sci-fi',
    releaseYear: 2014,
    averageRating: 4.6,
    totalRatings: 0,
    keywords: ['space', 'nolan', 'sci-fi', 'drama']
  },
  {
    name: 'Parasite',
    director: 'Bong Joon-ho',
    duration: 132,
    imageUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    genre: 'thriller',
    releaseYear: 2019,
    averageRating: 4.6,
    totalRatings: 0,
    keywords: ['korean', 'thriller', 'oscar']
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
        filmsWatched: 0
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
    const ratingSet = new Set(); // Track unique user-title combinations
    
    for (let i = 0; i < 10; i++) {
      // Create 10 random ratings
      let attempts = 0;
      let uniqueCombinationFound = false;
      
      while (!uniqueCombinationFound && attempts < 20) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const randomTitle = createdTitles[Math.floor(Math.random() * createdTitles.length)];
        const combinationKey = `${randomUser._id}-${randomTitle._id}`;
        
        if (!ratingSet.has(combinationKey)) {
          ratingSet.add(combinationKey);
          const randomRating = Math.floor(Math.random() * 5) + 1; // Random rating 1-5
          
          const rating = new Rating({
            userId: randomUser._id,
            titleId: randomTitle._id,
            rating: randomRating
          });
          
          await rating.save();
          uniqueCombinationFound = true;
        }
        attempts++;
      }
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
        content: `This is a sample review for ${randomTitle.name}. It's a film in the ${randomTitle.genre} genre.`,
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
