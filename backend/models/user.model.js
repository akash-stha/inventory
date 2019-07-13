var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    name: {
        type: String,
        uppercase: true
    },

    email: {
        type: String,
        unique: true,
        // required: true
        sparse: true,
        trim: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    address: {
        temporaryAddress: String,
        permanentAddress: String
    },

    phone: Number,

    activeUser: {
        type: Boolean,
        default: false
    },

    hobbies: [String],

    dob: Date,

    gender: {
        type: String,
        enum: ['male', 'female']
    },

    role: {
        type: String,
        enum: [1, 2, 3], //1-admin, 2-normal user, 3-visiter
        default: 2
    },

    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date

    // createdAt:Date,
    // updatedAt:Date

}, {
    timestamps: true
});

var UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;