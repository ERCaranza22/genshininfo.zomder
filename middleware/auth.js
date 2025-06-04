/**
 * Check if user is authenticated through session
 */
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    // Check if it's an API request
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    // For page requests, redirect to unauthorized page with return URL
    const returnUrl = encodeURIComponent(req.originalUrl);
    res.redirect(`/unauthorized?returnUrl=${returnUrl}`);
};

/**
 * Check if user is NOT authenticated (for login/signup pages)
 */
const isNotAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return next();
    }
    // If user is already logged in and trying to access login/signup pages,
    // redirect them to home page only if they don't have a specific return URL
    const returnUrl = req.query.returnUrl;
    if (returnUrl) {
        res.redirect(decodeURIComponent(returnUrl));
    } else {
        res.redirect('/');
    }
};

module.exports = {
    isAuthenticated,
    isNotAuthenticated
};
