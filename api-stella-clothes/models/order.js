const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  cartId: {
    type: String,
    required: true,
  },
  productsId: [
    {
      type: String,
      required: true,
    },
  ],
  paymentId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
