const Rating = require('../models/Rating');
const Title = require('../models/Title');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Error handler helper
const handleError = (res, error) => {
  console.error('Error:', error.message);
  res.status(500).json({ error: 'Internal server error', message: error.message });
};

exports.rateTitle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { titleId, rating } = req.body;
    const userId = req.session.userId;
    
    // Validate rating is between 1-5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if title exists
    const title = await Title.findById(titleId);
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Create or update rating
    const existingRating = await Rating.findOne({ userId, titleId });
    let savedRating;
    
    if (existingRating) {
      // Update existing rating
      const oldRating = existingRating.rating;
      existingRating.rating = rating;
      savedRating = await existingRating.save();
      
      // Update title's average rating
      await updateTitleAverageRating(titleId);
      
      res.json({ 
        message: 'Rating updated successfully',
        rating: savedRating,
        oldRating: oldRating,
        newRating: rating
      });
    } else {
      // Create new rating
      const newRating = new Rating({
        userId,
        titleId,
        rating
      });
      savedRating = await newRating.save();
      
      // The Rating model has a post-save hook that updates the title's average rating
      
      res.status(201).json({ 
        message: 'Rating saved successfully',
        rating: savedRating
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

// Helper function to update a title's average rating
async function updateTitleAverageRating(titleId) {
  try {
    const title = await Title.findById(titleId);
    if (!title) return;
    
    const ratings = await Rating.find({ titleId });
    if (ratings.length === 0) {
      title.averageRating = 0;
      title.totalRatings = 0;
    } else {
      const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
      title.averageRating = sum / ratings.length;
      title.totalRatings = ratings.length;
    }
    
    await title.save();
  } catch (error) {
    console.error('Error updating title average rating:', error);
  }
}

exports.getUserRating = async (req, res) => {
  try {
    const { titleId } = req.params;
    const userId = req.session.userId;
    
    // Check if title exists
    const titleExists = await Title.exists({ _id: titleId });
    if (!titleExists) {
      return res.status(404).json({ error: 'Title not found' });
    }

    const rating = await Rating.findOne({ userId, titleId });
    if (!rating) {
      return res.json({ hasRated: false });
    }

    res.json({
      hasRated: true,
      rating: rating.rating,
      createdAt: rating.createdAt
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get average rating for a title
exports.getTitleRating = async (req, res) => {
  try {
    const { titleId } = req.params;
    
    // Check if title exists
    const title = await Title.findById(titleId);
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }
    
    res.json({
      averageRating: title.averageRating,
      totalRatings: title.totalRatings
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteRating = async (req, res) => {
  try {
    const { titleId } = req.params;
    const userId = req.session.userId;
    
    // Check if title exists
    const titleExists = await Title.exists({ _id: titleId });
    if (!titleExists) {
      return res.status(404).json({ error: 'Title not found' });
    }

    const rating = await Rating.findOneAndDelete({ userId, titleId });
    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    // Update title's average rating
    await updateTitleAverageRating(titleId);

    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

// Get all ratings for a title
exports.getTitleRatings = async (req, res) => {
  try {
    const { titleId } = req.params;
    
    // Check if title exists
    const titleExists = await Title.exists({ _id: titleId });
    if (!titleExists) {
      return res.status(404).json({ error: 'Title not found' });
    }
    
    const ratings = await Rating.find({ titleId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
      
    // Calculate rating distribution
    const distribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    
    ratings.forEach(rating => {
      distribution[rating.rating]++;
    });
    
    res.json({
      ratings,
      distribution,
      count: ratings.length
    });
  } catch (error) {
    handleError(res, error);
  }
};
