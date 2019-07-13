//shift all the requires at the uppermost of the main file
var express = require('express');
var morgan = require('morgan');
var app = express();
var path = require('path');
var port = 4000;
//app is now overall express framework to be used. 

//import all routes.
var authRoute = require('./Controllers/auth');
var userRoute = require('./Controllers/user');
// console.log('auth is',authRoute);
// console.log('user is',userRoute);


//application level middleware

var authenticate = require('./Middlwares/authneticate');
// var authorize = require('./Middlewares/authorize');
// console.log('what comes in:',authenticate);
// console.log('what comes in:',authorize);

// app.get('/',function(req,res,next){
//     console.log('i am at get request of express server');
//     // res.end('hello');
//     // res.send('get data');
//     res.json({
//         name:'ram',
//         address:{
//             TempAddr:'tinkune',
//             PerAddr:'BKT'
//         }
//     })
// })

// app.post('/',function(req,res,next){
//     console.log('i am at post request');
//     res.send('post data');
// })

// app.put('/',function(req,res,next){
//     console.log('i am at put request');
//     res.send('put data');
// })


// app.delete('/',function(req,res,next){
//     console.log('i am at delete request');
//     res.send('delete data');
// })


// external middlwares are preferred to be made outside the main file. example inside middlwa
// wares folder
// var checkToken = function (req, res, next) {
//     // console.log('I am very first middleware function', req.headers);
//     console.log('checking token');


//     if (req.headers.token === 'ram') {
//         next();
//     } else {
//         res.send('token didnot match');
//     }
//     // res.end('you are blocked from middelware');
//     // next();
// }
// // app.use(checkToken); 

// function checkRole(req, res, next) {
//     console.log('checking role')
//     if (req.headers.role === '1') {
//         next();
//     } else {
//         res.send('you dont have access');
//     }
// }

// app.use(checkRole);

// app.use('/test',(req,res,next) => {
//     res.end('From empty route');
// })

app.set('port',6000);
var port = app.get('port');

// Third party miidleware
app.use(morgan('dev'));

// Inbuilt middleware
// app.use(express.static('Images'));
// app.use('/img', express.static('Images'));
app.use('/img',express.static(path.join(__dirname,'Images')));

// Router Level middleware
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/gallery', authRoute);


//application middleware to handle file not found
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
    console.log('i am error handling middleare');
    res.status(err.status || 400);
    res.json({
        message: err.message || err,
        status: err.status || 400
    })
});

app.listen(port, function (err, done) {
    if (err) {
        console.log('error in listening');
    } else {
        console.log('server listenig at port' + port);
        console.log('press CTRL + c to exit ');
    }
});