module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/');
    }
    next();
}

module.exports.isAdmin = (req, res, next) => {
    if(req.user.usertype === "admin") {
        return next();
    }
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You need admin rights to access this page!');
    return res.redirect('/');
}

module.exports.isUser = (req, res, next) => {
    if(req.user.usertype === "user") {
        return next();
    }
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You need to login as user to access this page!');
    return res.redirect('/');
}