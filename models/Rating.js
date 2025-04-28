const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  titleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Title',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only rate a title once
ratingSchema.index({ userId: 1, titleId: 1 }, { unique: true });

// Method to update title's average rating
ratingSchema.post('save', async function() {
  const Title = mongoose.model('Title');
  const title = await Title.findById(this.titleId);
  if (title) {
    await title.updateAverageRating(this.rating, true);
  }
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
