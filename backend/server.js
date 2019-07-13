//shift all the requires at the uppermost of the main file
var express = require('express');
var morgan = require('morgan');
var path = require('path');
var app = express();
var config = require('./config')
require('./db');
// var db = require('./db');
//since it doesn't have to import any thing from the db file so it is not necessary to store data in any
//variable
// var port = 5000;
//app is now overall express framework to be used. 

//import all routes.
var authRoute = require('./controllers/auth');
var userRoute = require('./controllers/user');
var productRoute = require('./controllers/product')();
// console.log('auth is',authRoute);
// console.log('user is',userRoute);
// console.log('product route is',productRoute);

//application level middleware
var authenticate = require('./Middlwares/authneticate');
// var authorize = require('./Middlewares/authorize');
// console.log('what comes in:',authenticate);
// console.log('what comes in:',authorize);
//templating engine
var pug = require('pug');
app.set('view engine', 'pug');
app.set('views', 'views');

// Third party miidleware
app.use(morgan('dev'));
app.use(require('cors')()); 

// Inbuilt middleware
app.use(express.static(path.join(__dirname, 'images')));
app.use('/img', express.static(path.join(__dirname, 'images')));

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

// Router Level middleware
app.use('/auth', authRoute);
app.use('/user',authenticate, userRoute);
app.use('/product',authenticate, productRoute);

//application middleware to handle path not found
app.use(function (req, res, next) {
    console.log('i am 404 handler middlware below routing');
    next({
        message: 'not found',
        status: 404
    })
});

// error handling middleware
app.use(function (err, req, res, next) {
    //first arg err is for error handling middleware.
    console.log('i am error handling middleware',err);
    res.status(err.status || 400);
    res.json({
        message: err.message || err,
        status: err.status || 400
    })
});

app.listen(config.port, function (err, done) {
    if (err) {
        console.log('error in listening');
    } else {
        console.log('server listenig at port ' + config.port);
        console.log('press CTRL + c to exit ');
    }
});