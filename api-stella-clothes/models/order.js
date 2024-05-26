const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    reference: 'Account',
    required: true,
  },
  contactInfo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    addressExtra: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  paymentId: {
    type: String,
    required: true,
  },
  nif: {
    type: String,
  },
  status: [
    {
      status: {
        type: String,
        enum: ['Em processo', 'Pago', 'Enviado', 'Entregue', 'Cancelado'],
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  pdfUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
