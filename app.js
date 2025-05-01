/**
 * Main application entry point
 * This file sets up our Express server, middleware, and routes
 * 
 * 4-29-2025: Modified by Cielina Lubrino--added path for active nav styling and mount routes
 */


// Load environment variables from .env file
require('dotenv').config();

// Core dependencies
const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ink_and_frame')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Please make sure MongoDB is running.');
  });

// Configure Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper functions for templates
app.locals.helpers = {
  isActiveRoute: (path, route) => path === route,
  currentYear: () => new Date().getFullYear(),
  formatDate: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
};

// Simple session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Simple authentication tracking middleware
app.use((req, res, next) => {
  // Make user data available to all templates
  res.locals.user = req.session.user || null;
  res.locals.isAuthenticated = !!req.session.user;
  res.locals.path = req.path;// 04-29-2025: Modified by CL
  next();
});

// Define routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Ink & Frame - Home' });
});

// Books and movies routes
app.get('/books', (req, res) => {
  res.render('books', { title: 'Books' });
});

app.get('/movies', (req, res) => {
  res.render('movies', { title: 'Movies' });
});

// API endpoints for titles
app.get('/api/titles', async (req, res) => {
  try {
    const Title = require('./models/Title');
    const titles = await Title.find();
    res.json(titles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API endpoints for reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const Review = require('./models/Review');
    const reviews = await Review.find().populate('userId', 'username');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//Routes for book,movies,titles,and user
const movieRoutes = require('./routes/movies');
const titleRoutes = require('./routes/titles');
const userRoutes = require('./routes/user');

app.use('/movies', movieRoutes);
app.use('/titles', titleRoutes);
app.use('/user', userRoutes);
