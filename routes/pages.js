const express = require('express');
const router = express.Router();
const path = require('path');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');

// Public routes
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Protected routes
router.get('/favourites', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'favorites.html'));
});

// Authentication routes (only accessible when not logged in)
router.get('/login', isNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

router.get('/signup', isNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
});

module.exports = router;
