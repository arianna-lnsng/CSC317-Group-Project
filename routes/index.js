/**
 * Main routes for the application
 */

const express = require('express');
const router = express.Router();

// Home page route
router.get('/', (req, res) => {
    res.render('index', {
        title: 'After the Credits - Home',
        message: 'Welcome to After the Credits! Join our community of film enthusiasts for post-viewing discussions and reviews.',
        // No need to set isAuthenticated here as it's handled by the setLocals middleware
    });
});

// About page route
router.get('/about', (req, res) => {
  res.render('about', { title: 'After the Credits - About' });
});

module.exports = router;
