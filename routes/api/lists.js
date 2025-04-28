/**
 * API Routes for User Lists (Watchlist and Reading List)
 * Handles all list-related API endpoints
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
    .withMessage('Title ID is required'),
  body('listType')
    .isIn(['watchlist', 'readingList'])
    .withMessage('List type must be either watchlist or readingList')
];

// Add a title to a list (watchlist or reading list)
router.post('/add',
  validateListOperation,
  listController.addToList
);

// Remove a title from a list
router.post('/remove',
  validateListOperation,
  listController.removeFromList
);

// Get all titles in a specific list
router.get('/:listType',
  param('listType')
    .isIn(['watchlist', 'readingList'])
    .withMessage('List type must be either watchlist or readingList'),
  listController.getList
);

// Check if a title is in a user's list
router.get('/check/:listType/:titleId',
  param('listType')
    .isIn(['watchlist', 'readingList'])
    .withMessage('List type must be either watchlist or readingList'),
  param('titleId')
    .notEmpty()
    .withMessage('Title ID is required'),
  listController.checkTitleInList
);

module.exports = router;
