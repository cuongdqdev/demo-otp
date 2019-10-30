const express = require('express');
const userRoute = express.Router();

let User = require('../models/user.model');

userRoute.route('/register')
    .post(async (req, res) => {
        const { username, password, email, fullname, phone } = req.body;
        let infoUser = await User.register(username, password, email, fullname, phone);
        return res.json({ data: infoUser });
    });

userRoute.route('/login')
    .post(async (req, res) => {
        const { usernameOrPhone, password } = req.body;
        let infoUser = await User.login(usernameOrPhone, password);
        req.session.USER = infoUser;
        return res.json({ data: infoUser });
    })

userRoute.route('/logout')
    .get(async (req, res) => {
        req.session.destroy();
        return res.json({ error: false, message: 'logout_success' })
    })

module.exports = userRoute;