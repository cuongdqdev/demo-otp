module.exports.requireUserLogin = async (req, res, next) => {
    if (!req.session.USER || !req.session) {
        return res.redirect('/users/login');
    }
    next();

}

module.exports.requireAdminLogin = async (req, res, next) => {
    if (!req.session.USER || !req.session) {
        return res.redirect('/users/login');
    }

    let infoUser = req.session.USER;

    if (!infoUser) return res.redirect('/users/login');

    if (infoUser.data.username !== 'admin') return res.redirect('/users/login');

    next();

}