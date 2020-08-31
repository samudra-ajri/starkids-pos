const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Material = require('../../models/Material');
const checkObjectId = require('../../middleware/checkObjectId');


// @route    POST api/materials
// @desc     Create material
// @access   Private
router.post('/', [auth, [
        check('name', 'Name is required').not().isEmpty(),
        check('quantity', 'Please include a valid quantity').isInt({ gt:0 }),
        check('unit', 'Please include a valid unit').not().isEmpty()
    ]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, quantity, unit } = req.body;

        try {
            let material = await Material.findOne({ name });

            if (material) {
                return res.status(400).json({ errors: [{ msg: 'Material already exists' }] });
            }

            material = new Material({
                name,
                quantity,
                unit
            });

            material = await material.save();

            res.json(material);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    GET api/materials
// @desc     Get all materials
// @access   Public
router.get('/', async (req, res) => {
    try {
        const materials = await Material.find().sort({ name: -1 });;
        res.json(materials);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/materials/:id
// @desc     Get material by ID
// @access   Public
router.get('/:id', checkObjectId('id'), async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);

        if (!material) {
            return res.status(404).json({ msg: 'Material not found' });
        }

        res.json(material);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/materials/:id
// @desc     Delete an material
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
    
        if (!material) {
            return res.status(404).json({ msg: 'Material not found' });
        }
    
        await material.remove();
    
        res.json({ msg: 'Material removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
  });

// @route    PUT api/materials/:id
// @desc     Update an material
// @access   Private
router.put('/:id', [auth, checkObjectId('id'), [
        check('name', 'Name is required').not().isEmpty(),
        check('quantity', 'Please include a valid quantity').isInt({ gt:0 }),
        check('unit', 'Please include a valid unit').not().isEmpty()
    ]], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, quantity, unit } = req.body;
        date = Date.now();

        const material = {
            name,
            quantity,
            unit,
            date
        };

        try {
            const updatedMaterial = await Material.findByIdAndUpdate(req.params.id, material, { new: true, upsert: true });
            
            res.json(updatedMaterial);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    PATCH api/materials/:id
// @desc     Update body document
// @access   Private
router.patch('/:id', [auth, checkObjectId('id')], async (req, res) => {
    req.body.date = Date.now();
    try {
        const material= await Material.findByIdAndUpdate(req.params.id, {$set: req.body}, { new: true, upsert: true });        

        res.json(material);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;