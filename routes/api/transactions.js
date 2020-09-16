const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Transaction = require('../../models/Transaction');
const Item = require('../../models/Item');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/transactions
// @desc     Create transaction
// @access   Private
router.post('/', [auth, [
        check('customer', 'Customer is required').not().isEmpty().isMongoId(),
        check('payment_type', 'Please include a valid payment type').not().isEmpty(),
        check('total', 'Please include a valid total payment').isInt({ gt:0 })
    ]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { customer, payment_type, stuff, total } = req.body;

        if (payment_type !== 'pelunasan') {
            if (!stuff) {
                return res.status(400).json({ errors: [{ msg: 'Please include a valid stuff', param: "stuff", location: "body" }] });
            } 
        }

        try {
            let transaction = new Transaction({
                customer, 
                payment_type, 
                stuff, 
                total
            });

            transaction = await transaction.save();

            res.json(transaction);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    GET api/transactions
// @desc     Get all transactions
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
        const from = req.query.from;
        const fromDate = new Date(req.query.from);
        const to = req.query.to;
        const toDate = new Date(req.query.to);
        const toPlusOne = toDate.setDate(toDate.getDate()+1);

        const match = {}
        if (from && to) {
            match.date = { '$gte':fromDate, '$lte':toPlusOne }
        } else if (from) {
            match.date = { '$gte':fromDate }
        } else if (to) {
            match.date = { '$lte':toPlusOne }
        }

        const customer = req.query.customer && req.query.customer;
        if (customer) match.customer = customer; 

        const pagination = req.query.pagination && parseInt(req.query.pagination);
        const page = req.query.page && parseInt(req.query.page);

        const dateSort = req.query.sortdate === 'asc' ? 1 : -1; // 1 = asc; -1 = desc

        const transactions = await Transaction.find( match )
        .skip((page - 1) * pagination)
        .limit(pagination)
        .populate({
            path:'customer',
            model:'customer',
            select:'name'
        })
        .populate({
            path:'stuff.item',
            model:'item',
            select:'name'
        })
        .sort({ date: dateSort });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/transactions/:id
// @desc     Get transaction by ID
// @access   Private
router.get('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id).populate('customer', ['name']);

        if (!transaction) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }

        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/transactions/:id
// @desc     Delete a transaction
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
    
        if (!transaction) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }
    
        await transaction.remove();
    
        res.json({ msg: 'Transaction removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
  });

// @route    PUT api/transactions/:id
// @desc     Update a transaction
// @access   Private
router.put('/:id', [auth, checkObjectId('id'), [
        check('customer', 'Calid customer is required').not().isEmpty().isMongoId(),
        check('payment_type', 'Please include a valid payment type').not().isEmpty(),
        check('total', 'Please include a valid payment type').isInt({ gt:0 })
    ]], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true, upsert: true });
            
            res.json(updatedTransaction);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;