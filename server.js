require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Import configuration and middleware
const config = require('./config/config');
const errorHandler = require('./middleware/error');

// Import routes
const pageRoutes = require('./routes/pages');
const authRoutes = require('./routes/auth');
const characterRoutes = require('./routes/characters');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: config.mongoURI,
        ttl: 24 * 60 * 60 // Session TTL (1 day)
    }),
    cookie: {
        secure: config.env === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// Routes
app.use('/', pageRoutes);
app.use('/api', authRoutes);
app.use('/api/characters', characterRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
// Handle process errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    process.exit(1);
});

// Connect to MongoDB and start server
mongoose.connect(config.mongoURI, {
    // MongoDB will retry the connection automatically
    serverSelectionTimeoutMS: 5000 // Try for 5 seconds before failing
})
.then(() => {
    console.log('Connected to MongoDB');
    // Start server only after successful database connection
    const server = app.listen(config.port, () => {
        console.log(`Server running on http://localhost:${config.port}`);
    });

    // Handle server shutdown
    const gracefulShutdown = () => {
        server.close(() => {
            console.log('Server closed. Database connections cleaned.');
            mongoose.connection.close(false, () => {
                console.log('MongoDb connection closed.');
                process.exit(0);
            });
        });
    };

    // Listen for shutdown signals
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
