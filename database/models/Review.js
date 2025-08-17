const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  user_id: {
    type: Number,
    required: true,
    index: true
  },
  product_id: {
    type: Number,
    required: true,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  verified_purchase: {
    type: Boolean,
    default: false
  },
  helpful_votes: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  }
});

reviewSchema.index({ product_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);