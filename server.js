require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const open = require('open');

// Import configuration and middleware
const config = require('./config/config');
const errorHandler = require('./middleware/error');

// Import models
const User = require('./models/User');

// Import routes
const pageRoutes = require('./routes/pages');
const authRoutes = require('./routes/auth');
const favoritesRoutes = require('./routes/favorites');

const app = express();

// Middleware
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: config.sessionSecret || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: config.mongoURI || 'mongodb://localhost:27017/genshin_info',
        ttl: 24 * 60 * 60,
        autoRemove: 'native',
        touchAfter: 24 * 3600
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax',
        path: '/'
    },
    name: 'connect.sid'
}));

// Add session debug middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    next();
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle HTML file routes
app.get('/:file', (req, res, next) => {
    const file = req.params.file;
    if (file.endsWith('.html')) {
        const filePath = path.join(__dirname, 'public', file);
        res.sendFile(filePath, err => {
            if (err) {
                console.error('File serving error:', err);
                next();
            }
        });
    } else {
        next();
    }
});

// API endpoint to check session status
app.get('/api/me', (req, res) => {
    try {
        if (req.session && req.session.user) {
            res.json({
                user: {
                    id: req.session.user.id,
                    username: req.session.user.username
                }
            });
        } else {
            res.status(401).json({ message: 'Not authenticated' });
        }
    } catch (error) {
        console.error('Session check error:', error);
        res.status(500).json({ message: 'Error checking session status' });
    }
});

// Page Routes (should be last to handle remaining routes)
app.use('/', pageRoutes);

// Error handling middleware
app.use(errorHandler);

// Handle 404s by serving index.html
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server function
const startServer = async () => {
    const port = process.env.PORT || 3000;
    const mongoUrl = config.mongoURI || 'mongodb://localhost:27017/genshin_info';

    try {
        // Connect to MongoDB
        await mongoose.connect(mongoUrl);
        console.log('\x1b[32m%s\x1b[0m', '✓ MongoDB Connected Successfully');

        // Start the server
        const server = app.listen(port, () => {
            const url = `http://localhost:${port}`;
            console.log('\x1b[36m%s\x1b[0m', `✓ Server running on ${url}`);
            
            // Open browser after a short delay
            setTimeout(async () => {
                try {
                    await open(url);
                    console.log('\x1b[32m%s\x1b[0m', '✓ Browser opened successfully');
                } catch (error) {
                    console.log('\x1b[33m%s\x1b[0m', `ℹ Please open manually: ${url}`);
                }
            }, 1000);
        });

        // Handle server shutdown
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                server.close();
                console.log('\n\x1b[32m%s\x1b[0m', '✓ Server and MongoDB connection closed gracefully');
                process.exit(0);
            } catch (err) {
                console.error('\x1b[31m%s\x1b[0m', '✗ Error during shutdown:', err);
                process.exit(1);
            }
        });

    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', '✗ Error starting server:', error);
        process.exit(1);
    }
};

// Start the server
startServer().catch(error => {
    console.error('\x1b[31m%s\x1b[0m', '✗ Fatal error:', error);
    process.exit(1);
});
