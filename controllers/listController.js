const User = require('../models/User');
const Title = require('../models/Title');
const { validationResult } = require('express-validator');

// Error handler helper
const handleError = (res, error) => {
  console.error('Error:', error.message);
  res.status(500).json({ error: 'Internal server error', message: error.message });
};

exports.addToList = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { titleId } = req.body;
    const userId = req.session.userId;

    // Check if title exists
    const title = await Title.findById(titleId);
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add to watchlist if not already present
    const alreadyInList = user.watchlist.some(id => id.toString() === titleId);
    
    if (!alreadyInList) {
      user.watchlist.push(titleId);
      user.filmsWatched += 1;
      await user.save();
      res.json({ 
        message: 'Film added to watchlist successfully',
        inList: true
      });
    } else {
      res.json({ 
        message: 'Film is already in your watchlist',
        inList: true
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

exports.removeFromList = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { titleId } = req.body;
    const userId = req.session.userId;

    // Check if title exists
    const titleExists = await Title.exists({ _id: titleId });
    if (!titleExists) {
      return res.status(404).json({ error: 'Title not found' });
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if film is in the watchlist
    const wasInList = user.watchlist.some(id => id.toString() === titleId);
    
    // Remove from watchlist
    user.watchlist = user.watchlist.filter(id => id.toString() !== titleId);

    // Decrement the counter if it was in the list
    if (wasInList) {
      user.filmsWatched -= 1;
    }
    
    await user.save();

    res.json({ 
      message: wasInList ? 
        'Film removed from watchlist successfully' : 
        'Film was not in your watchlist',
      inList: false
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.getList = async (req, res) => {
  try {
    const userId = req.session.userId;

    // Get user's watchlist with populated film data
    const user = await User.findById(userId).populate({
      path: 'watchlist',
      select: 'name director duration imageUrl genre releaseYear averageRating totalRatings'
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user.watchlist);
  } catch (error) {
    handleError(res, error);
  }
};

// Check if a title is in a user's list
exports.checkTitleInList = async (req, res) => {
  try {
    const { titleId } = req.params; 
    const userId = req.session.userId;
    
    // Check if title exists
    const titleExists = await Title.exists({ _id: titleId });
    if (!titleExists) {
      return res.status(404).json({ error: 'Title not found' });
    }
    
    // Get user and check if title is in the list
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const isInList = user.watchlist.some(id => id.toString() === titleId);
    
    res.json({
      inList: isInList
    });
  } catch (error) {
    handleError(res, error);
  }
};
