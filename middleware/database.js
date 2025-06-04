const mongoose = require('mongoose');

/**
 * Middleware to check if MongoDB is connected
 */
const checkDatabaseConnection = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: 'Database connection not available'
        });
    }
    next();
};

module.exports = checkDatabaseConnection;
