const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DebtSubsidiaryLedgerScheme = new mongoose.Schema({
  debtor: {
    type: Schema.Types.ObjectId,
    required: true
  },
  credit: {
    type: Number,
    default: 0,
    required: true
  },
  debit: {
    type: Number,
    default: 0,
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    required: true
  },
  description: {
      type: String,
      required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('debtsubsidiaryledger', DebtSubsidiaryLedgerScheme);
