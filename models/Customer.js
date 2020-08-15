const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  debt: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('customer', CustomerSchema);
