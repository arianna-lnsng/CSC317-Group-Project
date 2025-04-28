/**
 * Authentication routes for the application
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');

// Login page route
router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('auth/login', { title: 'Login' });
});

// Login form submission
router.post('/login', isNotAuthenticated, [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Invalid email or password',
        email
      });
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Invalid email or password',
        email
      });
    }
    
    // Set session
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email
    };
    req.session.userId = user._id;
    
    // Redirect to intended URL or default to home
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', {
      title: 'Login',
      error: 'An error occurred during login',
      email: req.body.email
    });
  }
});

// Register page route
router.get('/register', isNotAuthenticated, (req, res) => {
  res.render('auth/register', { title: 'Register' });
});

// Register form submission
router.post('/register', isNotAuthenticated, [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .isLength({ max: 20 }).withMessage('Username cannot exceed 20 characters'),
  body('email')
    .isEmail().withMessage('Please enter a valid email')
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email already in use');
      }
      return true;
    }),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Create new user
    const user = new User({
      username,
      email,
      password
    });
    
    await user.save();
    
    // Set session
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email
    };
    req.session.userId = user._id;
    
    res.redirect('/');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('auth/register', {
      title: 'Register',
      error: 'An error occurred during registration',
      username: req.body.username,
      email: req.body.email
    });
  }
});

// Logout route
router.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;
