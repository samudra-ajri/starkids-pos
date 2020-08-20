const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    retail: {
      type: Number,
      required: true
    },
    wholesale: {
      type: Number,
      required: true
    }
  },
  image: {
    type: String,
    default: "default.jpg"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('item', ItemSchema);
