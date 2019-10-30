const express = require('express');
const transactionRoute = express.Router();

let Transaction = require('../models/transaction.model');

transactionRoute.route('/transfer')
    .post(async (req, res) => {
        const { reciever, amount, note } = req.body;
        const sender = '1572112178392';
        let infoTransaction = await Transaction.transfer(sender, reciever, amount, note);
        req.session.TRANSACTION = infoTransaction;
        return res.json({ data: infoTransaction });
    });

transactionRoute.route('/verify')
    .post(async (req, res) => {
        let { TRANSACTION } = req.session;
        const { otpNumber } = req.body;
        let infoTransaction = await Transaction.verifyTransaction(otpNumber, TRANSACTION);
        if (infoTransaction.message === 'account_locked') delete req.session.TRANSACTION;
        if (infoTransaction.data && infoTransaction.data.status === '1') delete req.session.TRANSACTION;
        return res.json({ data: infoTransaction })
    })

module.exports = transactionRoute;