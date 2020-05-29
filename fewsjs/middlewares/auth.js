var Auth = {
    check_login: function (req, res, next)
    {
        if (!req.session.logged_in) {
            return res.redirect('/users/login');
        }

        next();
    },
    is_admin: function (req, res, next)
    {
        if (!req.session.admin) {

            req.flash('info', 'Maaf, Hanya admin yang dapat mengakses halaman ini!');
            return res.redirect('/users/login');
        }

        next();
    },
};

module.exports = Auth;