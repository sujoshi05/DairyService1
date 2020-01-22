var app = require('../app');
var http = require('http');
const mongoConnection = require('../database/mongo');
const decrption = require('../util/decrypt');
const logger = require('../util/winston');
var server = http.createServer(app);
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


if (process.env.KEY) {
    decrption(process.env.KEY)
        .then(() => {
            return mongoConnection.connectToMongo();
        }).then(() => {
            server.listen(port);
            server.on('error', onError);
            server.on('listening', onListening);
            // server.timeout = 60000; //1 min
        }).catch((e) => {
            logger.error('Error while starting the server ' + e);
            process.exit(1);
        });
} else {
    logger.error('Please provide the suncription key to start the server ' + process.env.KEY);
    process.exit(1);
}



function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        logger.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
    case 'EADDRINUSE':
        logger.error(bind + ' is already in use');
        process.exit(1);
        break;
    default:
        throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    logger.info(`Server strated at port ${bind}`);
}

process.on('uncaughtException', (err) => {
    logger.error('uncaughtException ' + err);
});