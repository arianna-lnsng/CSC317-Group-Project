const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const titleController = require('../../controllers/titleController');
const { isAuthenticated } = require('../../middleware/auth');

// Validation middleware
const validateTitle = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Title name is required')
    .isLength({ max: 200 })
    .withMessage('Title name must be less than 200 characters'),
  // Removed outdated 'type' validation
  // body('type')
  //   .trim()
  //   .notEmpty()
  //   .withMessage('Type is required')
  //   .isIn(['book', 'movie'])
  //   .withMessage('Type must be either book or movie'),
  body('imageUrl')
    .trim()
    .notEmpty()
    .withMessage('Image URL is required')
    .isURL()
    .withMessage('Invalid image URL'),
  body('genre')
    .trim()
    .notEmpty()
    .withMessage('Genre is required'),
  body('releaseYear')
    .isInt({ min: 1800, max: new Date().getFullYear() + 1 })
    .withMessage('Invalid release year')
];

// Routes
router.post('/',
  isAuthenticated,
  validateTitle,
  titleController.createTitle
);

router.get('/',
  titleController.getAllTitles
);

router.get('/:id',
  titleController.getTitleById
);

router.get('/:id/similar',
  titleController.getSimilarTitles
);

// Get reviews for a specific title
router.get('/:id/reviews',
  (req, res, next) => {
    req.params.titleId = req.params.id;
    next();
  },
  require('../../controllers/reviewController').getReviewsByTitle
);

// Get rating statistics for a specific title
router.get('/:id/ratings',
  (req, res, next) => {
    req.params.titleId = req.params.id;
    next();
  },
  require('../../controllers/ratingController').getTitleRatings
);

router.put('/:id',
  isAuthenticated,
  validateTitle,
  titleController.updateTitle
);

router.delete('/:id',
  isAuthenticated,
  titleController.deleteTitle
);

// Suggestion endpoint for autocomplete
router.get('/suggest', async (req, res) => {
  const { query } = req.query;
  if (!query || query.length < 1) {
    return res.json([]);
  }
  const regex = new RegExp(query, 'i');
  const suggestions = await require('../../models/Title').find({
    $or: [
      { name: regex },
      { director: regex }
    ]
  }, 'name _id imageUrl').limit(7);
  res.json(suggestions);
});

module.exports = router;
