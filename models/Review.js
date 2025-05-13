const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  titleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Title',
    required: true
  },
  reviewTitle: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add any helpful methods here
reviewSchema.methods.belongsTo = function(userId) {
  return this.userId.toString() === userId.toString();
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
