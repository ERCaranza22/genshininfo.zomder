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

router.get('/following', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'following.html'));
});

// Public error pages
router.get('/unauthorized', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'unauthorized.html'));
});

// Authentication routes
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
});

module.exports = router;
