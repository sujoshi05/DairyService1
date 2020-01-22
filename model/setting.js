const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Setting = new Schema({
    animal: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
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

Setting.index({ 'animal': 1 }, { unique: true });

Setting.pre('save', function preSave(next) {
    const bot = this;
    bot.lastModifiedAt = Date.now();
    next();
});

module.exports = mongoose.model('Setting', Setting);