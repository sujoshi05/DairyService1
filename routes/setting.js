var express = require('express');
var router = express.Router();
const settingController = require('../controllers/setting');
const { check, validationResult, body } = require('express-validator');

router.get('/', (req, res) => {
    settingController.getSetting()
        .then((settingObj) => {
            res.send(settingObj);
        }).catch((err) => {
            res.status(400).json({ 'Get errors': err });
            res.send(err);
        });
});


router.post('/clearData', (req, res) => {
    if (req.body.data === 'CLEAR') {
        settingController.clearData()
            .then(() => {
                res.send();
            }).catch((err) => {
                res.status(400).json({ 'Error': err });
            });
    } else {
        res.status(400).json({ 'Error': 'Invalid Request' });
    }
});

router.post('/', [
    body('animal').custom((value) => {
        if (value.match(/^[a-z ]+$/i)) {
            return true;
        } else {
            throw new Error('Please enter valid Animal');
        }
    }),
    check('rate').isNumeric().withMessage('Please enter numaric value'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        settingController.saveSetting(req.body)
            .then((newSetting) => {
                res.send(newSetting);
            }).catch((err) => {
                if (err && err.code === 11000) {
                    res.status(400).json({ 'message': 'This animal is already exist' });
                } else {
                    res.status(400).json({ 'Save errors': err });
                }
            });
    }
});

router.put('/', [
    body('animal').custom((value) => {
        if (value.match(/^[a-z ]+$/i)) {
            return true;
        } else {
            throw new Error('Please enter valid Animal');
        }
    }),
    check('rate').isNumeric().withMessage('Please enter numaric value'),
    check('id').isMongoId().withMessage('Please provide valid id'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        settingController.updateSetting(req.body)
            .then((newSetting) => {
                res.send(newSetting);
            }).catch((err) => {
                if (err && err.code === 11000) {
                    res.status(400).json({ 'message': 'This animal is already exist' });
                } else {
                    res.status(400).json({ 'Save errors': err });
                }
            });
    }
});



module.exports = router;
