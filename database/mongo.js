const mongoose = require('mongoose');
const logger = require('../util/winston');

async function connectToMongo() {
    logger.debug('Connecting to mongo');
    await mongoose.connect('mongodb://localhost/dairy', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        user: 'dairyUser',
        pass: 'M@123ongo',
    });
}

module.exports = {
    connectToMongo
};