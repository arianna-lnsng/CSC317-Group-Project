/**
 * reviews.js
 * 04-29-2025- Modified by Cielina Lubrino
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Validation middleware
const validateReview = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('content')
    .trim()
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Content must be less than 2000 characters')
];

// Routes
router.post('/', 
  isAuthenticated,
  validateReview,
  reviewController.createReview
);

router.get('/',
  reviewController.getAllReviews
);

router.get('/:id',
  reviewController.getReviewById
);

router.put('/:id',
  isAuthenticated,
  validateReview,
  reviewController.updateReview
);

router.delete('/:id',
  isAuthenticated,
  reviewController.deleteReview
);

module.exports = router;
