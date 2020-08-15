const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new mongoose.Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'customer',
    required: true
  },
  payment_type: {
    type: String,
    required: true
  },
  stuff:[
    {
      qty: {
        type: Number,
      },
      price_type: {
        type: String,
      },
      item: {
        type: Schema.Types.ObjectId,
        ref: 'item'
      }
    }
  ],
  total: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('transaction', TransactionSchema);
