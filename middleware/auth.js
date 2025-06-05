const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.redirect(`/login?returnUrl=${encodeURIComponent(req.originalUrl)}`);
};

module.exports = { isAuthenticated };