/**
 * User routes for the application
 * 04-29-2025- Modified by Cielina Lubrino
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');


// Protect all user routes
router.use(isAuthenticated);

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// User profile page
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    
    if (!user) {
      return res.redirect('/auth/login');
    }
    
    res.render('user/profile', {
      title: 'My Profile',
      user,
      helpers: {
        formatDate,
      },
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
// GET /user/settings - Render settings page
router.get('/settings', async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect('/auth/login');
    }

    res.render('user/settings', {
      title: 'Account Settings',
      user,
      csrfToken: req.csrfToken()
    });
  } catch (err) {
    console.error('Settings GET error:', err);
    res.render('error', {
      title: 'Error',
      message: 'Could not load settings',
      error: err
    });
  }
});

// POST /user/settings - Handle settings form submission
router.post('/settings', async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.redirect('/auth/login');
    }

    user.username = username;
    await user.save();

    req.flash('success', 'Settings updated successfully');
    res.redirect('/user/settings');
  } catch (err) {
    console.error('Settings POST error:', err);
    req.flash('error', 'Failed to update settings');
    res.redirect('/user/settings');
  }
});


// Removed User reading list page (lines 60-82)

module.exports = router;
