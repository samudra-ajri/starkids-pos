const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const DebtSubsidiaryLedger = require('../../models/DebtSubsidiaryLedger');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/debtsubsidiaryledgers
// @desc     Create debt subsidiary ledger
// @access   Private
router.post('/', [auth, [
        check('debtor', 'Debtor is required').not().isEmpty().isMongoId(),
        check('credit', 'Please include a valid credit').isInt({ gte:0 }),
        check('debit', 'Please include a valid debit').isInt({ gte:0 }),
        check('balance', 'Please include a valid balance').isInt({ gte:0 }),
        check('description', 'Please include a description').not().isEmpty()
    ]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { debtor, credit, debit, balance, description } = req.body;

        try {
            let debtSubsidiaryLedger = new DebtSubsidiaryLedger({
                debtor, 
                credit, 
                debit, 
                balance, 
                description
            });

            debtSubsidiaryLedger = await debtSubsidiaryLedger.save();

            res.json(debtSubsidiaryLedger);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan' }] });
        }
    }
);

// @route    GET api/debtsubsidiaryledgers
// @desc     Get all debt subsidiary ledgers
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

        const debtor = req.query.debtor && req.query.debtor;
        if (debtor) match.debtor = debtor; 

        const debtSubsidiaryLedger = await DebtSubsidiaryLedger.find( match ).sort({ date: 1 });
        
        res.json(debtSubsidiaryLedger);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan' }] });
    }
});

// @route    GET api/debtsubsidiaryledgers/:id
// @desc     Get debt subsidiary ledger by ID
// @access   Private
router.get('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const debtSubsidiaryLedger = await DebtSubsidiaryLedger.findById(req.params.id);

        if (!debtSubsidiaryLedger) {
            return res.status(404).json({ msg: 'Subsidiary Ledger not found' });
        }

        res.json(debtSubsidiaryLedger);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan' }] });
    }
});

// @route    DELETE api/debtsubsidiaryledgers/:id
// @desc     Delete a debt subsidiary ledger
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
    try {
        const debtSubsidiaryLedger = await DebtSubsidiaryLedger.findById(req.params.id);
    
        if (!debtSubsidiaryLedger) {
            return res.status(404).json({ msg: 'Subsidiary Ledger not found' });
        }
    
        await debtSubsidiaryLedger.remove();
    
        res.json({ msg: 'Subsidiary Ledger removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan' }] });
    }
  });

// @route    PUT api/debtsubsidiaryledgers/:id
// @desc     Update a deb tsubsidiary ledger
// @access   Private
router.put('/:id', [auth, checkObjectId('id'), [
        check('debtor', 'Debtor is required').not().isEmpty().isMongoId(),
        check('credit', 'Please include a valid credit').isInt({ gte:0 }),
        check('debit', 'Please include a valid debit').isInt({ gte:0 }),
        check('balance', 'Please include a valid balance').isInt({ gte:0 }),
        check('description', 'Please include a description').not().isEmpty()
    ]], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const debtSubsidiaryLedger = await DebtSubsidiaryLedger.findByIdAndUpdate(req.params.id, req.body, { new: true, upsert: true });
            
            res.json(debtSubsidiaryLedger);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Terjadi kesalahan' }] });
        }
    }
);

module.exports = router;