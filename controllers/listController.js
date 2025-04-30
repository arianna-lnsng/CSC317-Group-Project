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
    
    const { titleId, listType } = req.body;
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

    // Add to appropriate list if not already present
    const alreadyInList = user[listType].some(id => id.toString() === titleId);
    
    if (!alreadyInList) {
      user[listType].push(titleId);
      // Increment the relevant counter
      if (listType === 'watchlist') {
        user.moviesWatched += 1;
      } else if (listType === 'readingList') {
        user.booksRead += 1;
      }
      await user.save();
      res.json({ 
        message: `Title added to ${listType === 'watchlist' ? 'watchlist' : 'reading list'} successfully`,
        inList: true
      });
    } else {
      res.json({ 
        message: `Title is already in your ${listType === 'watchlist' ? 'watchlist' : 'reading list'}`,
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
    
    const { titleId, listType } = req.body;
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

    // Check if title is in the list
    const wasInList = user[listType].some(id => id.toString() === titleId);
    
    // Remove from appropriate list
    user[listType] = user[listType].filter(id => id.toString() !== titleId);

    // Decrement the relevant counter
    if (wasInList) {
      if (listType === 'watchlist') {
        user.moviesWatched -= 1;
      } else if (listType === 'readingList') {
        user.booksRead -= 1;
      }
    }
    
    await user.save();

    res.json({ 
      message: wasInList ? 
        `Title removed from ${listType === 'watchlist' ? 'watchlist' : 'reading list'} successfully` : 
        `Title was not in your ${listType === 'watchlist' ? 'watchlist' : 'reading list'}`,
      inList: false
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.getList = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { listType } = req.params;
    const userId = req.session.userId;

    // Get user's list with populated title data
    const user = await User.findById(userId).populate({
      path: listType,
      select: 'name type imageUrl genre releaseYear averageRating totalRatings'
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user[listType]);
  } catch (error) {
    handleError(res, error);
  }
};

// Check if a title is in a user's list
exports.checkTitleInList = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { listType, titleId } = req.params;
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
    
    const isInList = user[listType].some(id => id.toString() === titleId);
    
    res.json({
      inList: isInList,
      listType: listType
    });
  } catch (error) {
    handleError(res, error);
  }
};
