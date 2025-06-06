const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
};

// Get user's favorites
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ favorites: user.favorites || [] });
    } catch (error) {
        console.error('Error getting favorites:', error);
        res.status(500).json({ message: 'Error getting favorites' });
    }
});

// Add a character to favorites
router.post('/:character', isAuthenticated, async (req, res) => {
    try {
        const characterName = req.params.character;
        const user = await User.findById(req.session.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.favorites.includes(characterName)) {
            user.favorites.push(characterName);
            await user.save();
        }
        
        res.json({ message: 'Character added to favorites', favorites: user.favorites });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ message: 'Error adding favorite' });
    }
});

// Remove a character from favorites
router.delete('/:character', isAuthenticated, async (req, res) => {
    try {
        const characterName = req.params.character;
        const user = await User.findById(req.session.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.favorites = user.favorites.filter(fav => fav !== characterName);
        await user.save();
        
        res.json({ message: 'Character removed from favorites', favorites: user.favorites });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ message: 'Error removing favorite' });
    }
});

module.exports = router; 