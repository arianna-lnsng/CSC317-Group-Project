/**
 * API Routes for User Watchlist
 * Handles all watchlist-related API endpoints
 */

const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const listController = require('../../controllers/listController');
const { isAuthenticated } = require('../../middleware/auth');

// All routes require authentication
router.use(isAuthenticated);

// Validation middleware
const validateListOperation = [
  body('titleId')
    .notEmpty()
    .withMessage('Film ID is required')
];

// Add a film to watchlist
router.post('/add',
  validateListOperation,
  listController.addToList
);

// Remove a film from watchlist
router.post('/remove',
  validateListOperation,
  listController.removeFromList
);

// Get all films in watchlist
router.get('/watchlist',
  listController.getList
);

// Check if a film is in user's watchlist
router.get('/check/watchlist/:titleId',
  param('titleId')
    .notEmpty()
    .withMessage('Film ID is required'),
  listController.checkTitleInList
);

module.exports = router;
