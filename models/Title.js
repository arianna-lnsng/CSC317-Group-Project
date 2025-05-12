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
titleSchema.methods.updateAverageRating = async function(newRating, isNewRating) {
  if (isNewRating) {
    this.averageRating = ((this.averageRating * this.totalRatings) + newRating) / (this.totalRatings + 1);
    this.totalRatings += 1;
  }
  await this.save();
};

const Title = mongoose.model('Title', titleSchema);

module.exports = Title;
