const mongoose = require('mongoose');

const titleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Film title is required'],
    trim: true
  },
  director: {
    type: String,
    required: [true, 'Director name is required'],
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Film duration (in minutes) is required'],
    min: 1
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true,
    lowercase: true
  },
  releaseYear: {
    type: Number,
    required: [true, 'Release year is required'],
    min: 1800,
    max: new Date().getFullYear() + 1
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  keywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search functionality
titleSchema.index({ name: 'text', genre: 'text', director: 'text' });

// Method to update average rating
titleSchema.methods.updateAverageRating = async function() {
  const Rating = require('./Rating');
  const ratings = await Rating.find({ titleId: this._id });
  if (ratings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
  } else {
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = sum / ratings.length;
    this.totalRatings = ratings.length;
  }
  await this.save();
};

const Title = mongoose.model('Title', titleSchema);

module.exports = Title;
