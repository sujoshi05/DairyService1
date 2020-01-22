var express = require('express');
var router = express.Router();
const collectionController = require('../controllers/collection');
const { check, validationResult } = require('express-validator');


router.get('/get_customer_details/:cust_id/:month/:year', [
    check('cust_id').isMongoId(),
    check('year').isNumeric(),
    check('month').isNumeric(),
    check('page').isNumeric(),
    check('perPage').isNumeric()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        collectionController.getCollectionForCustomer(req.params)
            .then((data) => {
                res.send(data);
            }).catch((err) => {
                res.status(400).json({ 'Save errors': err });
                res.send(err);
            });
    }
});

router.get('/getDataForGraph', [
    check('year').isNumeric(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        collectionController.getDataForGraph(req.query)
            .then((data) => {
                res.send(data);
            }).catch((err) => {
                res.status(400).json({ 'Save errors': err });
                res.send(err);
            });
    }
});


router.post('/', [
    check('customerName').isMongoId(),
    check('date').isNumeric(),
    check('quantity').isNumeric(),
    check('quality').isNumeric(),
    check('animal').isAlpha(),
    check('rate').isNumeric()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        collectionController.SaveCollection(req.body)
            .then((newCollection) => {
                res.send(newCollection);
            }).catch((err) => {

                res.status(400).json({ 'Save errors': err });
                res.send(err);
            });
    }
});

router.get('/', [
    check('year').isNumeric(),
    check('month').isNumeric(),
    check('page').isNumeric(),
    check('perPage').isNumeric()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        collectionController.getCollection(req.query)
            .then((data) => {
                res.send(data);
            }).catch((err) => {
                res.status(400).json({ 'Save errors': err });
                res.send(err);
            });
    }
});

module.exports = router;

