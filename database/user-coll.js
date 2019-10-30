const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            require: true
        },
        password: {
            type: String,
            trim: true,
            require: true
        },
        email: {
            type: String,
            trim: true,
            require: true
        },
        fullname: {
            type: String,
            trim: true,
            require: true
        },
        phone: {
            type: String,
            trim: true,
            require: true
        },
        amount: {
            type: Number,
            trim: true,
            require: true,
            default: 1000000
        },
        account: {
            type: String,
            trim: true,
            require: true,
            default: Date.now()
        },
        status: {
            type: Number,
            trim: true,
            require: true,
            default: 1
        },
        authyID: {
            type: String,
            trim: true,
            require: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('user', userSchema);