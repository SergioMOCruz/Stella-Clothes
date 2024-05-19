const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
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
  password: {
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
  role: {
    type: String,
    required: true,
  },
  orderInfo: {
    contactInfo: {
      type: String
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    street: {
      type: String
    },
    addressExtra: {
      type: String
    },
    postalCode: {
      type: String
    },
    city: {
      type: String
    },
    country: {
      type: String
    },
    nif: {
      type: String
    },
    sessionId: {
      type: String
    }
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { versionKey: false });

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
