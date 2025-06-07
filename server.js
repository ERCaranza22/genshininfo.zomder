const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const open = require('open');

// Import configuration
const config = require('./config/config');
const PORT = process.env.PORT || config.port || 5000;

// Import routes
const pageRoutes = require('./routes/pages');
const characterRoutes = require('./routes/characters');
const authRoutes = require('./routes/auth');
const favoriteRoutes = require('./routes/favorites');

const app = express();

// Middleware
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Mount API routes first
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/favorites', favoriteRoutes);

// Serve static files from the public directory
app.use(express.static('public', {
    extensions: ['html', 'js', 'css']
}));

// Use page routes for HTML files
app.use('/', pageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// MongoDB connection handler
const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI, {
            dbName: 'genshin_info',
            ...config.mongoOptions
        });
        console.log('\x1b[32m%s\x1b[0m', '✓ MongoDB Connected Successfully');
        return true;
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', '✗ MongoDB Connection Error:', error.message);
        return false;
    }
};

// Start server function
const startServer = async () => {
    try {
        // Try to connect to MongoDB
        const isConnected = await connectDB();
        if (!isConnected) {
            console.log('\x1b[33m%s\x1b[0m', 'ℹ Retrying MongoDB connection in 5 seconds...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            const retryConnection = await connectDB();
            if (!retryConnection) {
                throw new Error('Failed to connect to MongoDB after retry');
            }
        }

        // Start the server
        const server = app.listen(PORT, () => {
            const url = `http://localhost:${PORT}`;
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
        const gracefulShutdown = async () => {
            try {
                await mongoose.connection.close();
                server.close();
                console.log('\n\x1b[32m%s\x1b[0m', '✓ Server and MongoDB connection closed gracefully');
                process.exit(0);
            } catch (err) {
                console.error('\x1b[31m%s\x1b[0m', '✗ Error during shutdown:', err);
                process.exit(1);
            }
        };

        // Handle various shutdown signals
        process.on('SIGINT', gracefulShutdown);
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGUSR2', gracefulShutdown); // For nodemon restart

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
