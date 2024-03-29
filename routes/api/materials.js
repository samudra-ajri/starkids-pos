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
        check('quantity', 'Please include a valid quantity').isInt({ gte:0 }),
        check('unit', 'Please include a valid unit').not().isEmpty(),
        check('price', 'Please include a valid price').isInt({ gte:0 })
    ]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, quantity, unit, price } = req.body;

        try {
            let material = await Material.findOne({ name });

            if (material) {
                return res.status(400).json({ errors: [{ msg: 'Nama bahan telah digunakan' }] });
            }

            material = new Material({
                name,
                quantity,
                unit,
                price
            });

            material = await material.save();

            res.json(material);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan' }] });
        }
    }
);

// @route    GET api/materials
// @desc     Get all materials
// @access   Public
router.get('/', async (req, res) => {
    try {
        const materials = await Material.find().sort({ name: 1 });;
        res.json(materials);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan' }] });
    }
});

// @route    GET api/materials/:id
// @desc     Get material by ID
// @access   Public
router.get('/:id', checkObjectId('id'), async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);

        if (!material) {
            return res.status(404).json({ msg: 'Bahan tidak ditemukan' });
        }

        res.json(material);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan' }] });
    }
});

// @route    DELETE api/materials/:id
// @desc     Delete an material
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
    
        if (!material) {
            return res.status(404).json({ msg: 'Bahan tidak ditemukan' });
        }
    
        await material.remove();
    
        res.json({ msg: 'Material removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan' }] });
    }
  });

// @route    PUT api/materials/:id
// @desc     Update an material
// @access   Private
router.put('/:id', [auth, checkObjectId('id'), [
        check('name', 'Name is required').not().isEmpty(),
        check('quantity', 'Please include a valid quantity').isInt({ gte:0 }),
        check('unit', 'Please include a valid unit').not().isEmpty(),
        check('price', 'Please include a valid price').isInt({ gte:0 })
    ]], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, quantity, unit, price } = req.body;
        date = Date.now();

        const material = {
            name,
            quantity,
            unit,
            price,
            date
        };

        try {
            const updatedMaterial = await Material.findByIdAndUpdate(req.params.id, material, { new: true, upsert: true });
            
            res.json(updatedMaterial);
        } catch (err) {
            if (err.codeName === 'DuplicateKey') {
                return res.status(400).json({ errors: [{ msg: 'Nama bahan telah digunakan' }] });
            }
            res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan' }] });
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
        res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan' }] });
    }
});

module.exports = router;