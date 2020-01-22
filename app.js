var express = require('express');
var path = require('path');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var customerRouter = require('./routes/customers');
var collectionRouter = require('./routes/collection');
var settingRouter = require('./routes/setting');
const logger = require('./util/winston');

var cors = require('cors');
var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/customers', customerRouter);
app.use('/collections', collectionRouter);
app.use('/setting', settingRouter);

app.use((req, res) => {
    res.status(404).send();
});

app.use((err, req, res) => {
    logger.error(err);
    res.status(err.status || 500);
    res.send(err);
});

module.exports = app;
