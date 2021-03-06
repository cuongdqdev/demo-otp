const express = require('express');
const userRoute = express.Router();

let User = require('../models/user.model');

userRoute.route('/register')
    .get(async (req, res) => {
        return res.render('register')
    })
    .post(async (req, res) => {
        const { username, password, email, fullname, phone } = req.body;
        let infoUser = await User.register(username, password, email, fullname, phone);
        return res.render('register', { infoUser });
    });

userRoute.route('/login')
    .get(async (req, res) => {
        return res.render('login');
    })
    .post(async (req, res) => {
        const { usernameOrPhone, password } = req.body;
        let infoUser = await User.login(usernameOrPhone, password);
        req.session.USER = infoUser;
        return res.render('home', { infoUser });
    })

userRoute.route('/logout')
    .get(async (req, res) => {
        req.session.destroy();
        return res.redirect('/');
    })

userRoute.route('/dashboard')
    .get(async (req, res) => {
        return res.render('dashboard');
    })

module.exports = userRoute;