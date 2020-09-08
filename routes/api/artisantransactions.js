const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const ArtisanTransaction = require('../../models/ArtisanTransaction');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/artisantransactions
// @desc     Create artisantransaction
// @access   Private
router.post('/', [auth, [
        check('artisan', 'Artisan is required').not().isEmpty(),
        check('item', 'Please include a valid item').not().isEmpty()
    ]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { materials, artisan, payment_type, item, qty_order, qty_finish, status, finish_date } = req.body;

        if (payment_type !== 'pelunasan') {
            if (!materials) {
                return res.status(400).json({ errors: [{ msg: 'Please include the valid materials', param: "materials", location: "body" }] });
            } 
        }

        try {
            let artisantransaction = new ArtisanTransaction({
                materials, 
                artisan, 
                payment_type, 
                item, 
                qty_order, 
                qty_finish, 
                status, 
                finish_date
            });

            artisantransaction = await artisantransaction.save();

            res.json(artisantransaction);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    GET api/artisantransactions
// @desc     Get all artisantransactions
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
            match.order_date = { '$gte':fromDate, '$lte':toPlusOne }
        } else if (from) {
            match.order_date = { '$gte':fromDate }
        } else if (to) {
            match.order_date = { '$lte':toPlusOne }
        }

        const artisan = req.query.artisan && req.query.artisan;
        if (artisan) match.artisan = artisan; 

        const pagination = req.query.pagination && parseInt(req.query.pagination);
        const page = req.query.page && parseInt(req.query.page);

        const artisantransactions = await ArtisanTransaction.find( match )
        .skip((page - 1) * pagination)
        .limit(pagination)
        .populate({
            path:'materials.material',
            model:'material',
            select:'name'
        })
        .sort({ order_date: -1 });
        res.json(artisantransactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/artisantransactions/:id
// @desc     Get artisantransaction by ID
// @access   Private
router.get('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const artisantransaction = await ArtisanTransaction.findById(req.params.id)
        .populate({
            path:'materials.material',
            model:'material',
            select:['name', 'unit']
        });

        if (!artisantransaction) {
            return res.status(404).json({ msg: 'Artisan transaction not found' });
        }

        res.json(artisantransaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/artisantransactions/:id
// @desc     Delete a artisantransaction
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const artisantransaction = await ArtisanTransaction.findById(req.params.id);
    
        if (!artisantransaction) {
            return res.status(404).json({ msg: 'Artisan transaction not found' });
        }
    
        await artisantransaction.remove();
    
        res.json({ msg: 'Artisan transaction removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/artisantransactions/:id
// @desc     Update a artisantransaction
// @access   Private
router.put('/:id', [auth, checkObjectId('id'), [
        check('artisan', 'Artisan is required').not().isEmpty(),
        check('item', 'Please include a valid item').not().isEmpty()
    ]], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedArtisanTransaction = await ArtisanTransaction.findByIdAndUpdate(req.params.id, req.body, { new: true, upsert: true });
            
            res.json(updatedArtisanTransaction);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    PATCH api/artisantransactions/:id
// @desc     Update body document
// @access   Private
router.patch('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const item= await ArtisanTransaction.findByIdAndUpdate(req.params.id, {$set: req.body}, { new: true, upsert: true });        

        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;