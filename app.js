/**
 * Main application entry point for After the Credits platform
 */

require('dotenv').config();

// Dependencies
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const csrf = require('csurf');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

// Routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const filmRoutes = require('./routes/films');
const titleRoutes = require('./routes/titles');
const apiTitleRoutes = require('./routes/api/titles');

// Middleware
const { setLocals } = require('./middleware/locals');
const { handleErrors } = require('./middleware/error-handler');

const app = express();

// MongoDB connection with fault tolerance
if (process.env.MONGODB_URI) {
  mongoose.set('autoIndex', false);
  mongoose.set('autoCreate', false);

  const mongooseOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
  };

  mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      console.log('Continuing without MongoDB. Some features may not work.');
    });
} else {
  console.log('No MONGODB_URI found. Authentication features disabled.');
}

// Security headers
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "image.tmdb.org", "m.media-amazon.com"],
      connectSrc: ["'self'"],
      formAction: ["'self'"],
    },
  })
);

app.use(cookieParser());

// Rate limiting configuration
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  handler: (req, res, next, options) => {
    console.warn(`General Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  },
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts from this IP, please try again after an hour',
  handler: (req, res, next, options) => {
    console.warn(`Auth Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  },
});

app.use(generalLimiter);

// Request parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
let sessionConfig = {
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'a_default_fallback_secret_change_this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
};

// Configure session store
if (process.env.MONGODB_URI) {
  try {
    sessionConfig.store = MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60,
      collectionName: 'sessions',
      autoRemove: 'native',
      touchAfter: 24 * 3600
    });
    console.log('MongoDB session store configured.');
  } catch (error) {
    console.error('Error configuring MongoDB session store:', error);
    console.warn('Using memory session store');
  }
} else {
  console.warn('Using memory session store');
}

app.use(session(sessionConfig));

// CSRF Protection with fallback
try {
  app.use(csrf({ cookie: false }));

  app.use((req, res, next) => {
    try {
      res.locals.csrfToken = req.csrfToken();
    } catch (err) {
      console.error('Error generating CSRF token:', err);
      res.locals.csrfToken = 'dummy-csrf-token-error-occurred';
    }
    next();
  });
} catch (err) {
  console.error('Error setting up CSRF protection:', err);
  app.use((req, res, next) => {
    res.locals.csrfToken = 'csrf-disabled-error-occurred';
    next();
  });
}

// Set template variables
app.use(setLocals);

// Route mounting
app.use('/', indexRoutes);
app.use('/auth', authLimiter, authRoutes);
app.use('/user', userRoutes);
app.use('/movies', filmRoutes);
app.use('/titles', titleRoutes);
app.use('/api/titles', apiTitleRoutes);

// Error handling - must be last middleware
app.use(handleErrors);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
