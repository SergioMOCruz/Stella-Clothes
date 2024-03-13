const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  commissions: {
    type: Number,
  },
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
