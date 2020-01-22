const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//const ObjectId = mongoose.ObjectId;

const Milk_Collection = new Schema({
    nameId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    date: {
        required: true,
        type: Date
    },
    quality: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    animal: {
        required: true,
        type: String
    },
    rate: {
        type: Number,
        required: true
    },
    comment: {
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


Milk_Collection.pre('save', function preSave(next) {
    const bot = this;
    bot.lastModifiedAt = Date.now();
    next();
});

module.exports = mongoose.model('Milk_Collection', Milk_Collection);