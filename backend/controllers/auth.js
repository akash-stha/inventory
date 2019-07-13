var express = require('express');

var router = express.Router();
var UserModel = require('./../models/user.model');
var mongodb = require('mongodb');
var jwt = require('jsonwebtoken');

var mapRequest = require('./../common/map_user_req')

var MongoClient = mongodb.MongoClient;
var config = require('./../config');

var passwordHash = require('password-hash');
var randomString = require('randomstring');
var nodemailer = require('nodemailer');
var sender = nodemailer.createTransport({
    service: 'Gmail',
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'newapunk92@gmail.com', // generated ethereal user
        pass: 'Newarpunk92@123' // generated ethereal password
    }
});

function prepareMail(data) {
    var mailOptions = {
        from: 'Paradise Nepal', // sender address
        to: `${data.email},aakashtha49@outlook.com`, // list of receivers
        subject: "Forgot Password", // Subject line
        text: "Hello world?", // plain text body
        html: `<div>
        <b>Hello ${data.username}</b>
        </div>
        <div>
        <p>We noticed you are trying to reset your password, Please click the link below to reset your password</p>
        </div>
        <div>
        <a href="${data.link}" target="_blank">Reset Password</a>
        </div>
        <div>
        Regards,
        </div>
        <div>
        Paradise Nepal Team
        </div>` // html body
    };
    return mailOptions;
}

function createToken(user) {
    var token = jwt.sign({
            username: user.username,
            id: user._id,
            role: user.role
        },
        config.jwtSecret, {
            // expiresIn:60
        });
    return token;
}

// var dbUrl = 'mongodb://localhost:27017'
// var dbName = 'group9db';

module.exports = router;

// router.post('/register', function (req, res, next) {
//     res.render('register');
// })

router.get('/user', function (req, res, next) {
    console.log('I am at get request inside auth');
    res.send('ok from get auth');
})

router.get('/login', function (req, res, next) {
    // var fs = require('fs');
    // fs.readFile('akshd.df', 'utf-8', function (err, done) {
    //     if (err) {
    //         return next(err)
    //     }
    //     res.status(200).json(done);
    // })
    // res.render('login',{
    //     name:'express',
    //     text:'welcome akash'
    // });
    res.render('login');
})

router.get('/register', function (req, res, next) {
    res.render('register');
})

router.put('/', function (req, res, next) {

})

router.post('/', function (req, res, next) {
    console.log('I am here at post request')
})


//login request
router.post('/login', function (req, res, next) {
    console.log('Request is here at post request of login', req.body);
    // MongoClient.connect(config.dbUrl, function (err, client) {
    //     if (err) {
    //         return next(err)
    //     }
    //     var db = client.db(config.dbName);
    //     db.collection('users').find({
    //         username: req.body.username,
    //         password: req.body.password
    //     }).toArray(function (err, user) {
    //         if (err) {
    //             return next(err)
    //         }
    //         res.status(200).json(user);
    //     })
    // })

    //NOTE find sends array data type, findOne sends object data and only one data.
    UserModel.findOne({
        username: req.body.username
        // password: req.body.password
    }, function (err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            var matched = passwordHash.verify(req.body.password, user.password);
            if (matched) {
                var token = createToken(user);
                res.status(200).json({
                    user: user,
                    token: token
                });
            } else {
                next({
                    message: 'password not matched',
                    // message:'invalid login credentials',
                    status: 200
                })
            }

        } else {
            next({
                message: 'user not found',
                // message:'invalid login credentials',
                status: 404
            })
        }
    })
})


//register request
router.post('/register', function (req, res, next) {
    console.log('Request is here at post request of register', req.body);
    //data is here now proceed with database

    // var obj = {
    //     name: req.body.name,
    //     email: req.body.email,
    //     username: req.body.username,
    //     password: req.body.password
    // }
    // MongoClient.connect(config.dbUrl, function (err, client) {
    //     if (err) {
    //         return next(err);
    //         console.log('error in connecting', err);
    //     }
    //     console.log('database connection success');
    //     var db = client.db(config.dbName);
    //     db.collection('users').insert(obj, function (err, done) {
    //         if (err) {
    //             next(err);
    //         } else {
    //             res.status(200).json(done);
    //         }
    //     })
    // });

    var newUser = new UserModel({});

    // newUser.name = req.body.name;
    // newUser.email = req.body.email;
    // newUser.username = req.body.username;
    // newUser.password = req.body.password;
    // newUser.phone = req.body.phoneNumber;
    // newUser.address = {
    //     temporaryAddress: req.body.tempAddr,
    //     permanentAddress: req.body.permanentAddr
    // };
    // newUser.hobbies = req.body.hobbies.split(',');
    // newUser.dob = new Date(req.body.dob);
    // newUser.gender = req.body.gender;
    // newUser.role = req.body.role;

    var mappedUser = mapRequest(newUser, req.body);

    // newUser.createdAt = new Date();
    // newUser.updatedAt=new Date();

    mappedUser.password = passwordHash.generate(req.body.password);

    mappedUser.save(function (err, done) {
        // newUser.save(function (err, done) {
        if (err) {
            return next(err)
        }
        res.status(200).json(done);
    });

})

router.delete('/', function (req, res, next) {

})

router.post('/forgot-password', function (req, res, next) {

    UserModel.findOne({
        email: req.body.email
    }).exec(function (err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            var resetToken = randomString.generate(25);
            var resetTokenExpiry = Date.now() + 1000 * 60 * 60 * 24;

            user.resetPasswordToken = resetToken;
            user.resetPasswordTokenExpiry = new Date(resetTokenExpiry);

            var username = user.username;
            var email = user.email;
            var link = req.headers.origin + '/auth/reset-password/' + resetToken


            var mailData = {
                username,
                email,
                link
            }

            var mailBody = prepareMail(mailData);

            sender.sendMail(mailBody, function (err, done) {
                if (err) {
                    return next(err);
                }
                // res.json(done);
                user.save(function (err, done) {
                    if (err) {
                        return next(err);
                    }
                    res.json(done);
                });

            })

        } else {
            next({
                message: 'Email not registered yet.'
            });
        }
    })

})