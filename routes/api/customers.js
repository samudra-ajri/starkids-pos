const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Customer = require('../../models/Customer');
const checkObjectId = require('../../middleware/checkObjectId');


// @route    POST api/customers
// @desc     Create customer
// @access   Private
router.post('/', [auth, [
        check('name', 'Name is required').not().isEmpty()
    ]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, address, phone, debt } = req.body;

        try {
            let customer = await Customer.findOne({ $or:[{name}, {email}] });

            if (customer) {
                return res.status(400).json({ errors: [{ msg: 'Nama atau Email telah digunakan' }] });
            }

            customer = new Customer({
                name, 
                email, 
                address, 
                phone, 
                debt
            });

            customer = await customer.save();

            res.json(customer);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan' }] });
        }
    }
);

// @route    GET api/customers
// @desc     Get all customers
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
        const match = {}
        const name = req.query.name && req.query.name;
        if (name) match.name = name;

        const customers = await Customer.find( match ).sort({ name: 1 });

        res.json(customers);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan' }] });
    }
});

// @route    GET api/customers/:id
// @desc     Get customer by ID
// @access   Private
router.get('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ msg: 'Pelanggan tidak ditemukan' });
        }

        res.json(customer);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan' }] });
    }
});

// @route    DELETE api/customers/:id
// @desc     Delete a customer
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
    
        if (!customer) {
            return res.status(404).json({ msg: 'Pelanggan tidak ditemukan' });
        }
    
        await customer.remove();
    
        res.json({ msg: 'Customer removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan' }] });
    }
  });

// @route    PUT api/customers/:id
// @desc     Update a customer
// @access   Private
router.put('/:id', [auth, checkObjectId('id'), [
        check('name', 'Name is required').not().isEmpty()
    ]], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, upsert: true });
            
            res.json(updatedCustomer);
        } catch (err) {
            if (err.codeName === 'DuplicateKey') {
                return res.status(400).json({ errors: [{ msg: 'Nama atau Email telah digunakan' }] });
            }
            res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan' }] });
        }
    }
);

// @route    PATCH api/customers/:id
// @desc     Update body document
// @access   Private
router.patch('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const item= await Customer.findByIdAndUpdate(req.params.id, {$set: req.body}, { new: true, upsert: true });        

        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan' }] });
    }
});

module.exports = router;