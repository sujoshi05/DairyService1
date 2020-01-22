var express = require('express');
var router = express.Router();
var multer = require('multer');
const customerController = require('../controllers/customer');
const { check, validationResult, body} = require('express-validator');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        const index = file.mimetype.indexOf('/');
        const filetype = file.mimetype.substr(index + 1);
        cb(null, `${req.body.first_name} ${req.body.last_name} (${req.body.aadhaar_no}).${filetype}`);
    }
});
var upload = multer({ storage: storage });
router.get('/', (req, res) => {
    customerController.getCustomers()
        .then((custObj) => {
            res.send(custObj);
        }).catch((err) => {
            res.status(400).json({ 'Get errors': err });
            res.send(err);
        });
});

//currently not in use
router.get('/:id', [
    check('id').isMongoId()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        customerController.getCustomer(req.params.id)
            .then((custObj) => {
                res.send(custObj);
            }).catch((err) => {
                res.status(400).json({ 'Get errors': err });
                res.send(err);
            });
    }
});

//currently not in use
router.get('/name/:name', (req, res) => {
    customerController.getCustomerByName(req.params.name)
        .then((custObj) => {
            res.send(custObj);
        }).catch((err) => {
            res.status(400).json({ 'Get errors': err });
            res.send(err);
        });
});

router.post('/', upload.single('avatar'), [
    body('first_name').custom((value) => {
        if (value.match(/^[a-z\s]+$/i)) {
            return true;
        } else {
            throw new Error('Please enter valid First Name');
        }
    }),
    body('last_name').custom((value) => {
        if (value.match(/^[a-z\s]+$/i)) {
            return true;
        } else {
            throw new Error('Please enter valid Last name');
        }
    }),
    check('mobile').isNumeric().withMessage('Please enter numaric value')
        .isLength({ min: 10, max: 10 }).withMessage('Please enter valid mobile no'),
    check('aadhaar_no').isNumeric().withMessage('Please enter numaric value')
        .isLength({ min: 12, max: 12 })
        .withMessage('Please enter valid adhaar no')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        req.body.name = `${req.body.first_name} ${req.body.last_name}`.trim();
        customerController.saveCustomer(req.body)
            .then((newCustomer) => {
                res.send(newCustomer);
            }).catch((err) => {
                res.status(400).json({ 'Save errors': err });
                res.send(err);
            });
    }
});


module.exports = router;
