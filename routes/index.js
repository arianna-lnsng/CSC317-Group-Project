/**
 * Main routes for the application
 */

/**
 * 04-29-2025: Modified by Cielina Lubrino-added message and isAuthenticated
 */

const express = require('express');
const router = express.Router();

// Home page route
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Ink & Frame - Home',
        message: 'Welcome to Ink & Frame! Discover your next favorite book or movie.',
        isAuthenticated: !!req.session.user
    });
});

// About page route
router.get('/about', (req, res) => {
  res.render('about', { title: 'Ink & Frame - About' });
});

module.exports = router;
