const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Artisan = require('../../models/Artisan');
const checkObjectId = require('../../middleware/checkObjectId');


// @route    POST api/artisans
// @desc     Create artisan
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
            let artisan = await Artisan.findOne({ name });

            if (artisan) {
                return res.status(400).json({ errors: [{ msg: 'Artisan already exists' }] });
            }

            artisan = new Artisan({
                name, 
                email, 
                address, 
                phone, 
                debt
            });

            artisan = await artisan.save();

            res.json(artisan);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    GET api/artisans
// @desc     Get all artisans
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
        const match = {}
        const name = req.query.name && req.query.name;
        if (name) match.name = name;

        const artisans = await Artisan.find( match ).sort({ name: 1 });
        res.json(artisans);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/artisans/:id
// @desc     Get artisan by ID
// @access   Private
router.get('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const artisan = await Artisan.findById(req.params.id);

        if (!artisan) {
            return res.status(404).json({ msg: 'Artisan not found' });
        }

        res.json(artisan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/artisans/:id
// @desc     Delete a artisan
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const artisan = await Artisan.findById(req.params.id);
    
        if (!artisan) {
            return res.status(404).json({ msg: 'Artisan not found' });
        }
    
        await artisan.remove();
    
        res.json({ msg: 'Artisan removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
  });

// @route    PUT api/artisans/:id
// @desc     Update a artisan
// @access   Private
router.put('/:id', [auth, checkObjectId('id'), [
        check('name', 'Name is required').not().isEmpty()
    ]], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedArtisan = await Artisan.findByIdAndUpdate(req.params.id, req.body, { new: true, upsert: true });
            
            res.json(updatedArtisan);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    PATCH api/artisans/:id
// @desc     Update body document
// @access   Private
router.patch('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const item= await Artisan.findByIdAndUpdate(req.params.id, {$set: req.body}, { new: true, upsert: true });        

        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;