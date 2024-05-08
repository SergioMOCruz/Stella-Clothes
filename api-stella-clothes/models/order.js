const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
  },
  productsId: [
    {
      type: Number,
      required: true,
    },
  ],
  paymentId: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
