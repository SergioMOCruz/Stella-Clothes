const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new mongoose.Schema({
  car: {
    type: Schema.ObjectId,
    ref: 'Car',
    required: true,
  },
  licencePlate: {
    type: String,
  },
  client: {
    type: Schema.ObjectId,
    ref: 'Client',
    required: true,
  },
  phone: {
    type: String,
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
  employee: {
    type: Schema.ObjectId,
    ref: 'Employee',
    required: true,
  },
  code : {
    type: String,
  },
  services: {
    type: [String],
    required: true,
  },
  obs: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  clientType: {
    type: Boolean,
    default: false,
  },
  finalPrice: { 
    type: Number,
  },
  prePaid: {
    type: Boolean,
    default: false,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  receipt: {
    type: Boolean,
    default: false,
  },
  state: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
