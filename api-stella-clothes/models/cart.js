const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
  },
  productsId: [
    {
      type: String,
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
