/**
 * API Routes for Ratings
 * Handles all rating-related API endpoints
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const ratingController = require('../../controllers/ratingController');
const { isAuthenticated } = require('../../middleware/auth');

// Validation middleware
const validateRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('titleId')
    .notEmpty()
    .withMessage('Title ID is required')
];

// All routes require authentication
router.use(isAuthenticated);

// Rate a title (create or update rating)
router.post('/', 
  validateRating,
  ratingController.rateTitle
);

// Get current user's rating for a title
router.get('/user/:titleId', 
  ratingController.getUserRating
);

// Get average rating for a title
router.get('/title/:titleId', 
  ratingController.getTitleRating
);

// Get all ratings for a title with distribution data
router.get('/title/:titleId/all', 
  ratingController.getTitleRatings
);

// Delete a rating
router.delete('/:titleId', 
  ratingController.deleteRating
);

module.exports = router;
