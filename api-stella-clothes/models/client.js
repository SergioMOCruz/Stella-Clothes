const mongoose = require('mongoose');
const { Schema } = mongoose;

const clientSchema = new mongoose.Schema({
  name: {
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
  calledIn: {
    type: Boolean,
    default: false,
  },
  cars: [
    {
      type: Schema.ObjectId,
      ref: 'Car',
    },
  ],
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
