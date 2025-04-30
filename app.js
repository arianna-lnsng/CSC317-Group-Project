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
const MongoStore = require('connect-mongo');
const { ServerApiVersion } = require('mongodb');

// Initialize Express app
const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const options = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/after_the_credits', options);
    
    // Send a ping to confirm a successful connection
    await conn.connection.db.command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error('Connection string:', process.env.MONGODB_URI);
    }
    process.exit(1);
  }
};

// Initialize database connection
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
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

// Session configuration
const sessionConfig = {
  secret: process.env.JWT_SECRET || 'your_secure_session_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/after_the_credits',
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: process.env.NODE_ENV === 'production'
  }
};

// Use secure cookies in production
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(session(sessionConfig));

// Security middleware for production
if (process.env.NODE_ENV === 'production') {
  const helmet = require('helmet');
  app.use(helmet());
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

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
  res.render('index', { title: 'After the Credits - Home' });
});

// Films route
app.get('/films', (req, res) => {
  res.render('films', { title: 'Films' });
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

//Routes for films and user
const filmRoutes = require('./routes/films');
const titleRoutes = require('./routes/titles');
const userRoutes = require('./routes/user');

app.use('/films', filmRoutes);
app.use('/titles', titleRoutes);
app.use('/user', userRoutes);

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
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Running on Render');
  }
});
