const mongoose = require('mongoose');
const { Schema } = mongoose;

const clientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password : {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  nif: {
    type: String,
    unique: true,
  },
  address: {
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
