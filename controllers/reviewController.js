const Review = require('../models/Review');
const Title = require('../models/Title');
const { validationResult } = require('express-validator');

// Error handler helper
const handleError = (res, error) => {
  console.error('Error:', error.message);
  res.status(500).json({ error: 'Internal server error', message: error.message });
};

exports.createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { titleId, reviewTitle, content, rating } = req.body;
    const userId = req.session.userId;
    
    // Verify title exists
    const titleExists = await Title.exists({ _id: titleId });
    if (!titleExists) {
      return res.status(404).json({ error: 'Title not found' });
    }
    
    // Check if user already has a review for this title
    const existingReview = await Review.findOne({ userId, titleId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this title. Please edit your existing review instead.' });
    }

    const review = new Review({
      titleId,
      reviewTitle,
      content,
      rating,
      userId
    });

    await review.save();
    
    // Populate user info before sending response
    await review.populate('userId', 'username');
    
    res.status(201).json(review);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const { titleId, userId, sort } = req.query;
    let query = {};
    
    // Apply filters if provided
    if (titleId) query.titleId = titleId;
    if (userId) query.userId = userId;
    
    // Set up sort options
    let sortOptions = { createdAt: -1 }; // Default: newest first
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    else if (sort === 'rating-high') sortOptions = { rating: -1 };
    else if (sort === 'rating-low') sortOptions = { rating: 1 };
    
    const reviews = await Review.find(query)
      .populate('userId', 'username')
      // Removed 'type' from populate as it doesn't exist on Title model
      .populate('titleId', 'name imageUrl') 
      .sort(sortOptions);
      
    res.json(reviews);
  } catch (error) {
    handleError(res, error);
  }
};

// Get reviews for a specific title
exports.getReviewsByTitle = async (req, res) => {
  try {
    const { titleId } = req.params;
    
    // Verify title exists
    const titleExists = await Title.exists({ _id: titleId });
    if (!titleExists) {
      return res.status(404).json({ error: 'Title not found' });
    }
    
    const reviews = await Review.find({ titleId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });
      
    res.json(reviews);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('userId', 'username');
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (!review.belongsTo(req.session.userId)) {
      return res.status(403).json({ error: 'Not authorized to edit this review' });
    }

    Object.assign(review, req.body);
    await review.save();
    res.json(review);
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (!review.belongsTo(req.session.userId)) {
      return res.status(403).json({ error: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};
