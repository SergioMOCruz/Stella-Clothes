const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
  },
  productReference:  {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
