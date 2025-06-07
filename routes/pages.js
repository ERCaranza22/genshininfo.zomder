const express = require('express');
const router = express.Router();
const path = require('path');

// Serve main pages
router.get(['/', '/index', '/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

router.get('/favorites.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'favorites.html'));
});

// Authentication pages
router.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

router.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
});

module.exports = router;
