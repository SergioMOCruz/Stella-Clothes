const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      reference: 'Account',
      required: true,
    },
    productsIds: [
      {
        type: Schema.Types.ObjectId,
        reference: 'Product',
        required: true,
      },
    ],
    address: {
      street: {
        type: String,
        required: true,
      },
      addressContinued: {
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
      type: Number,
      required: true,
    },
    nif : {
      type: String,
    },
    status: [
      {
        status: {
          type: String,
          enum: ['Em processo', 'Pago', 'Enviado', 'Entregue', 'Cancelado'],
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
