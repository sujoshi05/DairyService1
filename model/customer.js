const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Customer = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    adhaarNo: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    // createdBy: {
    //     type: ObjectId
    // },
    // lastModifiedBy: {
    //     type: ObjectId
    // },
    createdAt: {
        type: Date
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now
    }
});


Customer.pre('save', function preSave(next) {
    const bot = this;
    bot.lastModifiedAt = Date.now();
    next();
});

module.exports = mongoose.model('Customer', Customer);