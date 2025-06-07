const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const open = require('open');

// Import configuration
const config = require('./config/config');

// Import routes
const pageRoutes = require('./routes/pages');
const characterRoutes = require('./routes/characters');
const authRoutes = require('./routes/auth');

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

// Serve index.html as the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve static files (except HTML)
app.use(express.static(path.join(__dirname, 'public'), {
    index: 'index.html', // Set index.html as the default file
    extensions: ['js', 'css', 'png', 'jpg', 'gif', 'ico', 'svg']
}));

// Mount routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/characters', characterRoutes); // API routes
app.use('/', pageRoutes); // HTML routes last

// Handle 404s
app.use((req, res) => {
    if (req.path.endsWith('.html')) {
        res.status(404).send('Page not found');
    } else {
        res.status(404).json({ message: 'Not found' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start server function
const startServer = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('\x1b[32m%s\x1b[0m', '✓ MongoDB Connected Successfully');

        // Start the server
        const server = app.listen(config.port, '0.0.0.0', () => {
            const url = `http://localhost:${config.port}`;
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
