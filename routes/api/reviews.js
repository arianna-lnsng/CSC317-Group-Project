/**
 * API Routes for Reviews
 * Handles all review-related API endpoints
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const reviewController = require('../../controllers/reviewController');

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Validation middleware
const validateReview = [
  body('reviewTitle')
    .trim()
    .notEmpty()
    .withMessage('Review title is required')
    .isLength({ max: 200 })
    .withMessage('Review title must be less than 200 characters'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('content')
    .trim()
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Content must be less than 2000 characters'),
  body('titleId')
    .notEmpty()
    .withMessage('Title ID is required')
];

// Get all reviews with optional filtering
router.get('/', reviewController.getAllReviews);

// Get reviews for a specific title
router.get('/title/:titleId', reviewController.getReviewsByTitle);

// Get a specific review by ID
router.get('/:id', reviewController.getReviewById);

// Create a new review
router.post('/', 
  isAuthenticated,
  validateReview,
  reviewController.createReview
);

// Update an existing review
router.put('/:id',
  isAuthenticated,
  validateReview,
  reviewController.updateReview
);

// Delete a review
router.delete('/:id',
  isAuthenticated,
  reviewController.deleteReview
);

module.exports = router;
