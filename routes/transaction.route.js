const express = require('express');
const transactionRoute = express.Router();

let Transaction = require('../models/transaction.model');

transactionRoute.route('/transfer')
    .get(async (req, res) => {
        let infoUser = req.session.USER;
        let account = infoUser.data.account;
        let infoHistoryTransaction = await Transaction.historyTransaction(account);
        return res.render('home', { infoUser, infoHistoryTransaction });
    })
    .post(async (req, res) => {
        const { reciever, amount, note } = req.body;
        const infoUser = req.session.USER;
        let sender = infoUser.data.account;
        let infoTransaction = await Transaction.transfer(sender, reciever, Number(amount), note);
        req.session.TRANSACTION = infoTransaction;
        return res.redirect('/transactions/verify')
    });

transactionRoute.route('/verify')
    .get(async (req, res) => {
        return res.render('verify');
    })
    .post(async (req, res) => {
        let { TRANSACTION } = req.session;
        const { otpNumber } = req.body;
        let infoTransaction = await Transaction.verifyTransaction(otpNumber, TRANSACTION);
        if (infoTransaction.message === 'account_locked') req.session.TRANSACTION=undefined;
        if (infoTransaction.data || infoTransaction.data.status === 1) req.session.TRANSACTION=undefined;
        return res.render({ data: infoTransaction })
    })

module.exports = transactionRoute;