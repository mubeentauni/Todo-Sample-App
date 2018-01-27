var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var customError = require('./error');
var cors = require('cors');

mongoose.connect('localhost:27017/Todo');
var api = require('./routes/api');

var app = express();

app.use(cors({credentials: true, origin: '*'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());


app.get('/', function (req, res) {
    res.send('Under construction.');
});

app.use('/api', api);

app.use(function (req, res, next) {
    var err = new customError(404,'Not Found');
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;

    // render the error page
    res.status(err.status || 500);
    res.json(err);
});



module.exports = app;