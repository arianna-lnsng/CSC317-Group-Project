const Title = require('../models/Title');
const { validationResult } = require('express-validator');

// Error handler helper
const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
};

exports.createTitle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const title = new Title(req.body);
    await title.save();
    res.status(201).json(title);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getAllTitles = async (req, res) => {
  try {
    const { genre, minRating, type, search } = req.query;
    let query = {};

    // Apply filters
    if (genre) query.genre = genre.toLowerCase();
    if (type) query.type = type.toLowerCase();
    if (minRating) query.averageRating = { $gte: parseFloat(minRating) };
    if (search) query.$text = { $search: search };

    const titles = await Title.find(query);
    res.json(titles);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getTitleById = async (req, res) => {
  try {
    const title = await Title.findById(req.params.id);
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }
    res.json(title);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateTitle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const title = await Title.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }

    res.json(title);
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteTitle = async (req, res) => {
  try {
    const title = await Title.findByIdAndDelete(req.params.id);
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

exports.getSimilarTitles = async (req, res) => {
  try {
    const title = await Title.findById(req.params.id);
    if (!title) {
      return res.status(404).json({ error: 'Title not found' });
    }

    const similarTitles = await Title.find({
      _id: { $ne: title._id },
      genre: title.genre,
      type: title.type
    }).limit(5);

    res.json(similarTitles);
  } catch (error) {
    handleError(res, error);
  }
};
