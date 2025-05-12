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
    averageRating: 0,
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
    averageRating: 0,
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
    averageRating: 0,
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
    averageRating: 0,
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
    averageRating: 0,
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
    averageRating: 0,
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
    averageRating: 0,
    totalRatings: 0,
    keywords: ['crime', 'hitmen', 'Quentin Tarantino']
  },
  {
    name: 'Toy Story',
    director: 'John Lasseter',
    duration: 81,
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZjQwLTg5NzItYzZlYWRjYjE2YzM3XkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_.jpg',
    genre: 'animation',
    releaseYear: 1995,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['animation', 'pixar', 'adventure', 'family']
  },
  {
    name: 'Jurassic Park',
    director: 'Steven Spielberg',
    duration: 127,
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BNjViNWYwZTAtYjQwZi00ZTIwLTg2YjMtYjQzYjYzYjYzYjYzXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
    genre: 'adventure',
    releaseYear: 1993,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['dinosaurs', 'adventure', 'spielberg']
  },
  {
    name: 'Forrest Gump',
    director: 'Robert Zemeckis',
    duration: 142,
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTAtYzYwZi00ZTIwLTg2YjMtYjQzYjYzYjYzYjYzXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
    genre: 'drama',
    releaseYear: 1994,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['drama', 'oscar', 'classic']
  },
  {
    name: 'The Matrix',
    director: 'Lana Wachowski, Lilly Wachowski',
    duration: 136,
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3NjAtNDQyZi00ZTIwLTg2YjMtYjQzYjYzYjYzYjYzXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
    genre: 'sci-fi',
    releaseYear: 1999,
    averageRating: 0,
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
    averageRating: 0,
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
    averageRating: 0,
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
    averageRating: 0,
    totalRatings: 0,
    keywords: ['korean', 'thriller', 'oscar']
  },
  {
    name: 'Avengers: Endgame',
    director: 'Anthony Russo, Joe Russo',
    duration: 181,
    imageUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    genre: 'action',
    releaseYear: 2019,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['marvel', 'superhero', 'action']
  },
  {
    name: 'The Lion King',
    director: 'Roger Allers, Rob Minkoff',
    duration: 88,
    imageUrl: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
    genre: 'animation',
    releaseYear: 1994,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['disney', 'animation', 'family']
  },
  {
    name: 'Finding Nemo',
    director: 'Andrew Stanton',
    duration: 100,
    imageUrl: 'https://image.tmdb.org/t/p/w500/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg',
    genre: 'animation',
    releaseYear: 2003,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['pixar', 'animation', 'adventure']
  },
  {
    name: 'The Silence of the Lambs',
    director: 'Jonathan Demme',
    duration: 118,
    imageUrl: 'https://image.tmdb.org/t/p/w500/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg',
    genre: 'thriller',
    releaseYear: 1991,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['thriller', 'crime', 'oscar']
  },
  {
    name: 'Forrest Gump',
    director: 'Robert Zemeckis',
    duration: 142,
    imageUrl: 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg',
    genre: 'drama',
    releaseYear: 1994,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['drama', 'oscar', 'classic']
  },
  {
    name: 'The Matrix',
    director: 'Lana Wachowski, Lilly Wachowski',
    duration: 136,
    imageUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    genre: 'sci-fi',
    releaseYear: 1999,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['sci-fi', 'action', 'matrix']
  },
  {
    name: 'Back to the Future',
    director: 'Robert Zemeckis',
    duration: 116,
    imageUrl: 'https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg',
    genre: 'sci-fi',
    releaseYear: 1985,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['sci-fi', 'adventure', 'comedy']
  },
  {
    name: 'The Social Network',
    director: 'David Fincher',
    duration: 120,
    imageUrl: 'https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg',
    genre: 'drama',
    releaseYear: 2010,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['drama', 'biography', 'facebook']
  },
  {
    name: 'Get Out',
    director: 'Jordan Peele',
    duration: 104,
    imageUrl: 'https://image.tmdb.org/t/p/w500/1SwAVYpuLj8KsHxllTF8Dt9dSSX.jpg',
    genre: 'horror',
    releaseYear: 2017,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['horror', 'thriller', 'social']
  },
  {
    name: 'La La Land',
    director: 'Damien Chazelle',
    duration: 128,
    imageUrl: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
    genre: 'musical',
    releaseYear: 2016,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['musical', 'romance', 'drama']
  },
  {
    name: 'The Grand Budapest Hotel',
    director: 'Wes Anderson',
    duration: 99,
    imageUrl: 'https://image.tmdb.org/t/p/w500/nX5XotM9yprCKarRH4fzOq1VM1J.jpg',
    genre: 'comedy',
    releaseYear: 2014,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['Wes Anderson', 'mystery', 'adventure', 'comedy']
  },
  {
    name: 'Whiplash',
    director: 'Damien Chazelle',
    duration: 106,
    imageUrl: 'https://image.tmdb.org/t/p/w500/oPxnRhyAIzJKGUEdSiwTJQBa6zE.jpg',
    genre: 'drama',
    releaseYear: 2014,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['music', 'drama', 'oscar']
  },
  {
    name: 'The Godfather Part II',
    director: 'Francis Ford Coppola',
    duration: 202,
    imageUrl: 'https://image.tmdb.org/t/p/w500/bVq65huQ8vHDd1a4Z37QtuyEvpA.jpg',
    genre: 'crime',
    releaseYear: 1974,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['mafia', 'crime', 'drama', 'classic']
  },
  {
    name: 'The Departed',
    director: 'Martin Scorsese',
    duration: 151,
    imageUrl: 'https://image.tmdb.org/t/p/w500/6bCplVkhowCjTHXWv49UjRPn0eK.jpg',
    genre: 'crime',
    releaseYear: 2006,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['crime', 'thriller', 'oscar']
  },
  {
    name: 'The Prestige',
    director: 'Christopher Nolan',
    duration: 130,
    imageUrl: 'https://image.tmdb.org/t/p/w500/5MXyQfz8xUP3dIFPTubhTsbFY6N.jpg',
    genre: 'drama',
    releaseYear: 2006,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['magic', 'thriller', 'nolan']
  },
  {
    name: 'Coco',
    director: 'Lee Unkrich',
    duration: 105,
    imageUrl: 'https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg',
    genre: 'animation',
    releaseYear: 2017,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['pixar', 'animation', 'music']
  },
  {
    name: 'Joker',
    director: 'Todd Phillips',
    duration: 122,
    imageUrl: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    genre: 'drama',
    releaseYear: 2019,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['joker', 'dc', 'drama']
  },
  {
    name: 'Blade Runner 2049',
    director: 'Denis Villeneuve',
    duration: 164,
    imageUrl: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    genre: 'sci-fi',
    releaseYear: 2017,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['sci-fi', 'thriller', 'future']
  },
  {
    name: 'The Incredibles',
    director: 'Brad Bird',
    duration: 115,
    imageUrl: 'https://image.tmdb.org/t/p/w500/2LqaLgk4Z226KkgPJuiOQ58wvrm.jpg',
    genre: 'animation',
    releaseYear: 2004,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['pixar', 'animation', 'superhero']
  },
  {
    name: 'Shrek',
    director: 'Andrew Adamson, Vicky Jenson',
    duration: 90,
    imageUrl: 'https://image.tmdb.org/t/p/w500/iB64vpL3dIObOtMZgX3RqdVdQDc.jpg',
    genre: 'animation',
    releaseYear: 2001,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['animation', 'comedy', 'family']
  },
  {
    name: 'The Wolf of Wall Street',
    director: 'Martin Scorsese',
    duration: 180,
    imageUrl: 'https://image.tmdb.org/t/p/w500/pWHf4khOloNVfCxscsXFj3jj6gP.jpg',
    genre: 'biography',
    releaseYear: 2013,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['biography', 'comedy', 'crime']
  },
  {
    name: 'Black Panther',
    director: 'Ryan Coogler',
    duration: 134,
    imageUrl: 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg',
    genre: 'action',
    releaseYear: 2018,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['marvel', 'superhero', 'action']
  },
  {
    name: 'Up',
    director: 'Pete Docter',
    duration: 96,
    imageUrl: 'https://image.tmdb.org/t/p/w500/9kQWyLZodYyM3y71l1jN6gJ8b4v.jpg',
    genre: 'animation',
    releaseYear: 2009,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['pixar', 'animation', 'adventure']
  },
  {
    name: 'Inglourious Basterds',
    director: 'Quentin Tarantino',
    duration: 153,
    imageUrl: 'https://image.tmdb.org/t/p/w500/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg',
    genre: 'war',
    releaseYear: 2009,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['war', 'tarantino', 'drama']
  },
  {
    name: 'Eternal Sunshine of the Spotless Mind',
    director: 'Michel Gondry',
    duration: 108,
    imageUrl: 'https://image.tmdb.org/t/p/w500/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg',
    genre: 'romance',
    releaseYear: 2004,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['romance', 'drama', 'sci-fi']
  },
  {
    name: 'The Big Lebowski',
    director: 'Joel Coen, Ethan Coen',
    duration: 117,
    imageUrl: 'https://image.tmdb.org/t/p/w500/5gTQkK6bYyq0Qh6U6F9g1eRrF2Q.jpg',
    genre: 'comedy',
    releaseYear: 1998,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['comedy', 'cult', 'crime']
  },
  {
    name: 'Her',
    director: 'Spike Jonze',
    duration: 126,
    imageUrl: 'https://image.tmdb.org/t/p/w500/yk4J4aewWYNiBhD49WD7UaBBn37.jpg',
    genre: 'sci-fi',
    releaseYear: 2013,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['sci-fi', 'romance', 'drama']
  },
  {
    name: 'Inside Out',
    director: 'Pete Docter',
    duration: 95,
    imageUrl: 'https://image.tmdb.org/t/p/w500/aAmfIX3TT40zUHGcCKrlOZRKC7u.jpg',
    genre: 'animation',
    releaseYear: 2015,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['pixar', 'animation', 'family']
  },
  {
    name: 'The Revenant',
    director: 'Alejandro G. Iñárritu',
    duration: 156,
    imageUrl: 'https://image.tmdb.org/t/p/w500/oXUWEc5i3wYyFnL1Ycu8ppxxPvs.jpg',
    genre: 'adventure',
    releaseYear: 2015,
    averageRating: 0,
    totalRatings: 0,
    keywords: ['adventure', 'drama', 'oscar']
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
