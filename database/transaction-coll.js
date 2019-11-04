const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let transactionSchema = new Schema(
    {
        sender: {
            type: String,
            trim: true,
            require: true
        },
        reciever: {
            type: String,
            trim: true,
            require: true
        },
        amount: {
            type: String,
            trim: true,
            require: true
        },
        note: {
            type: String,
            trim: true,
            require: true
        },
        status: {
            type: String,
            trim: true,
            require: true,
            default: 0
        },
        inValidOTP: {
            type: Number,
            trim: true,
            require: true,
            default: 0
        },
        OTP: {
            type: Number,
            trim: true,
            require: true,
            default: 000000
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('transaction', transactionSchema);