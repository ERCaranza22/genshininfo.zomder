// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Default error
    let statusCode = 500;
    let message = 'Something went wrong!';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized access';
    } else if (err.code === 11000) {
        statusCode = 409;
        message = 'Duplicate resource found';
    }

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

module.exports = errorHandler;
