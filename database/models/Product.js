const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category_id: {
    type: Number,
    required: true,
    index: true
  },
  brand: {
    type: String,
    required: true,
    index: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  stock_quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  discount_percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  image_url: {
    type: String
  },
  images: [{
    type: String
  }],
  is_active: {
    type: Boolean,
    default: true
  },
  availability_status: {
    type: String,
    enum: ['In Stock', 'Out of Stock', 'Limited Stock'],
    default: 'In Stock'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

productSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

productSchema.virtual('discounted_price').get(function() {
  if (this.discount_percentage > 0) {
    return this.price * (1 - this.discount_percentage / 100);
  }
  return this.price;
});

module.exports = mongoose.model('Product', productSchema);