const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArtisanTransactionSchema = new mongoose.Schema({
    materials:[
        {
            qty: {
                type: Number,
            },
            material: {
                type: Schema.Types.ObjectId,
                ref: 'material'
            }
        }
    ],
    artisan: {
        type: String,
        required: true
    },
    item: {
        type: String,
        required: true
    },
    qty_order: {
        type: Number,
    },
    qty_finish: {
        type: Number,
    },
    status: {
        type: String,
        default: 'On Progress'
    },
    order_date: {
        type: Date,
        default: Date.now
    },
    finish_date: {
        type: Date
    }
});

module.exports = mongoose.model('artisantransaction', ArtisanTransactionSchema);
