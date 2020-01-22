const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, json, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    try {
        const msg = (typeof message === 'string') ? message : JSON.stringify(message);
        return `${timestamp} ${level}: ${msg}`;
    } catch (e) {
        console.log('Error in my format of winston');
    }
});

const logger = createLogger({
    transports: [
        new transports.File({
            level: 'info',
            filename: './logs/all.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false,
            format: combine(
                timestamp({ format: 'DD-MMM-YYYY hh:mm:ss A ZZ' }),
                json()
            )
        }),
        new transports.Console({
            level: process.env.level || 'debug',
            handleExceptions: true,
            format: combine(
                timestamp({ format: 'DD-MMM-YYYY hh:mm:ss A ZZ' }),
                colorize({ level: true }),
                myFormat
            )

        })
    ],
    exitOnError: false
});

logger.on('error', (err) => {
    console.log('Error from winston logger', err);
});

module.exports = logger;