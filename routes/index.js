/**
 * Main routes for the application
 */

const express = require('express');
const router = express.Router();

// Home page route
router.get('/', (req, res) => {
  res.render('index', { title: 'Ink & Frame - Home' });
});

// About page route
router.get('/about', (req, res) => {
  res.render('about', { title: 'Ink & Frame - About' });
});

module.exports = router;
