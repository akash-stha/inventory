var express = require('express');

var router = express.Router();
var mongodb = require('mongodb');

var config = require('./../config')
var MongoClient = mongodb.MongoClient;
var oid = mongodb.ObjectID;
var authorize = require('./../middlwares/authorize');

var UserModel = require('./../models/user.model');
var mapUserReq = require('./../common/map_user_req');


// var dbUrl = 'mongodb://localhost:27017'
// var dbName = 'group9db';

module.exports = router;

router.get('/', function (req, res, next) {
    console.log('logged in user ',req.loggedInUser);

    // console.log('req.query', req.query);
    // MongoClient.connect(config.dbUrl, function (err, client) {
    //     if (err) {
    //         return next(err);
    //     }
    //     var db = client.db(config.dbName);
    //     db.collection('users').find({}).toArray(function (err, users) {
    //         if (err) {
    //             return next(err)
    //         }
    //         res.status(200).json(users);
    //     })
    // })

    UserModel.find({})
        // .sort({
        //     _id:-1
        // })
        // .skip(2)
        // .limit(2)
        .exec(function (err, users) {
            if (err) {
                return next(err)
            }
            res.status(200).json(users)
        })
    })

router.get('/:id', function (req, res, next) {
    console.log('logged in user ',req.loggedInUser);

    console.log('req.params', req.params);
    // res.json(req.params);\
    var id = req.params.id;

    // MongoClient.connect(config.dbUrl, function (err, client) {
    //     if (err) {
    //         return next(err);
    //     }
    //     var db = client.db(config.dbName);
    //     db.collection('users').find({
    //         // username: req.params.username
    //         _id: new oid(id)
    //     }).toArray(function (err, user) {
    //         if (err) {
    //             return next(err)
    //         }
    //         res.status(200).json(user);
    //     })
    // })

    UserModel.findById(id).exec(function (err, user) {
        // UserModel.find({_id:req.params.id}).exec(function(err,user){
            if (err) {
                return next(err);
            }if(user){
                res.status(200).json(user);
            }else{
                next({
                    message:'user not found',
                    status:404
                });
            }
        });

});

router.put('/:id',authorize, function (req, res, next) {
    console.log('logged in user ',req.loggedInUser);

    var id = req.params.id;

    // MongoClient.connect(config.dbUrl, function (err, client) {
    //     if (err) {
    //         return next(err);
    //     }
    //     var db = client.db(config.dbName);
    //     db.collection('users').update({
    //         _id: new oid(id)
    //     }, {
    //         $set: req.body
    //     }, function (err, done) {
    //         if (err) {
    //             return next(err);
    //         }
    //         res.status(200).json(done);
    //     });
    // })

    UserModel.findById(id).exec(function (err, user) {
        if (err) {
            return next(err)
        }
        if (user) {
            // if (req.body.name)
            //     user.name = req.body.name;
            // if (req.body.email)
            //     user.email = req.body.email;
            // if (req.body.username)
            //     user.username = req.body.username;
            // if (req.body.password)
            //     user.password = req.body.password;
            // if (req.body.phone)
            //     user.phone = req.body.phoneNumber;
            // if (req.body.tempAddr || req.body.permanentAddr)
            //     user.address = {
            //         temporaryAddress: req.body.tempAddr,
            //         permanentAddress: req.body.permanentAddr
            //     };
            // if (req.body.hobbies)
            //     user.hobbies = req.body.hobbies.split(',');
            // if (req.body.dob)
            //     user.dob = new Date(req.body.dob);
            // if (req.body.gender)
            //     user.gender = req.body.gender;
            // if (req.body.role)
            //     user.role = req.body.role;

            var updatedMappedUser = mapUserReq(user, req.body);

            // user.save(function (err, done) {
                updatedMappedUser.save(function (err, done) {
                    if (err) {
                        return next(err)
                    }
                    res.status(200).json(done)
                })
            } else {
                next({
                    message: 'user not found',
                    status: 404
                })
            }
        })

})

router.delete('/:id', function (req, res, next) {
    console.log('logged in user ',req.loggedInUser);

    var id = req.params.id;
    UserModel.findById(id).exec(function(err,user){
        if(err){
            return next(err);
        }
        if(user){ 
            user.remove(function(err,removed){
                if(err){
                    return next(err);
                }
                res.status(200).json(removed);
            });
        }else{
            next({
                message:'user not found',
                status:404
            });
        }
    });
});

    // MongoClient.connect(config.dbUrl, function (err, client) {
    //     if (err) {
    //         return next(err)
    //     }
    //     var db = client.db(config.dbName);
    //     db.collection('users').remove({
    //         _id: new oid(id)
    //     }, function (err, done) {
    //         if (err) {
    //             return next(err)
    //         }
    //         res.status(200).json(done);
    //     })
    // })
    



// router.post('/', function (req, res, next) {
//     console.log('I am at post request inside user');
//     res.send('ok from post user');
// })