const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Item = require('../../models/Item');
const checkObjectId = require('../../middleware/checkObjectId');


// @route    POST api/items
// @desc     Create item
// @access   Private
router.post('/', [auth, [
        check('name', 'Name is required').not().isEmpty(),
        check('quantity', 'Please include a valid quantity').isInt({ gt:0 }),
        check('retail', 'Please include a valid price').isInt({ gt: 0 }),
        check('wholesale', 'Please include a valid price').isInt({ gt: 0 })
    ]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, quantity, image, retail, wholesale } = req.body;

        try {
            let item = await Item.findOne({ name });

            if (item) {
                return res.status(400).json({ errors: [{ msg: 'Item already exists' }] });
            }

            item = new Item({
                name,
                quantity,
                image,
                price: {retail, wholesale}
            });

            item = await item.save();

            res.json(item);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    GET api/items
// @desc     Get all items
// @access   Public
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/items/:id
// @desc     Get item by ID
// @access   Public
router.get('/:id', checkObjectId('id'), async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/items/:id
// @desc     Delete an item
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
    
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }
    
        await item.remove();
    
        res.json({ msg: 'Item removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
  });

// @route    PUT api/items/:id
// @desc     Update an item
// @access   Private
router.put('/:id', [auth, checkObjectId('id'), [
        check('name', 'Name is required').not().isEmpty(),
        check('quantity', 'Please include a valid quantity').isInt({ gt:0 }),
        check('retail', 'Please include a valid price').isInt({ gt: 0 }),
        check('wholesale', 'Please include a valid price').isInt({ gt: 0 })
    ]], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, quantity, image, retail, wholesale } = req.body;

        const item = {
            name,
            quantity,
            image,
            price: {retail, wholesale}
        };

        try {
            const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, { new: true, upsert: true });
            
            res.json(updatedItem);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    POST api/items/upload
// @desc     Upload item image
// @access   Private
router.post('/upload', auth, async (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded'});
    }

    const file = req.files.file;
    const nameItem = req.body.nameItem;

    file.mv(`${__dirname}/../../client/src/img/${nameItem}_${file.name}`, err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }

        res.json({ fileName: file.name, filePath: `/img/${file.name}` });
    });
});

// @route    PATCH api/items/:id
// @desc     Update body document
// @access   Private
router.patch('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const item= await Item.findByIdAndUpdate(req.params.id, {$set: req.body}, { new: true, upsert: true });        

        res.json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;