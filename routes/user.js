/**
 * User routes for the application
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

// Protect all user routes
router.use(isAuthenticated);

// User profile page
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect('/auth/login');
    }
    
    res.render('user/profile', {
      title: 'My Profile',
      user
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.render('error', {
      title: 'Error',
      message: 'An error occurred while loading your profile',
      error
    });
  }
});

// User watchlist page
router.get('/watchlist', async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
      .populate('watchlist');
    
    if (!user) {
      return res.redirect('/auth/login');
    }
    
    res.render('user/watchlist', {
      title: 'My Watchlist',
      watchlist: user.watchlist
    });
  } catch (error) {
    console.error('Watchlist error:', error);
    res.render('error', {
      title: 'Error',
      message: 'An error occurred while loading your watchlist',
      error
    });
  }
});

// User reading list page
router.get('/reading-list', async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
      .populate('readingList');
    
    if (!user) {
      return res.redirect('/auth/login');
    }
    
    res.render('user/reading-list', {
      title: 'My Reading List',
      readingList: user.readingList
    });
  } catch (error) {
    console.error('Reading list error:', error);
    res.render('error', {
      title: 'Error',
      message: 'An error occurred while loading your reading list',
      error
    });
  }
});

module.exports = router;
