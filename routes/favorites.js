const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const auth = require('../middleware/auth');

// Get user's favorites
router.get('/', auth, async (req, res) => {
    try {
        let favorites = await Favorite.findOne({ userId: req.user.id });
        if (!favorites) {
            return res.json([]);
        }
        res.json(favorites.characters);
    } catch (err) {
        console.error('Error getting favorites:', err);
        res.status(500).json({ message: 'Server error while getting favorites' });
    }
});

// Add or update favorites
router.post('/', auth, async (req, res) => {
    try {
        let favorites = await Favorite.findOne({ userId: req.user.id });
        
        if (!favorites) {
            favorites = new Favorite({
                userId: req.user.id,
                characters: []
            });
        }

        // Update favorites list
        favorites.characters = req.body.characters;
        
        await favorites.save();
        res.json(favorites.characters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a single character to favorites
router.post('/add', auth, async (req, res) => {
    try {
        if (!req.body.name || !req.body.image || !req.body.element || !req.body.stars || !req.body.weapon) {
            return res.status(400).json({ message: 'Missing required character information' });
        }

        let favorites = await Favorite.findOne({ userId: req.user.id });
        
        if (!favorites) {
            favorites = new Favorite({
                userId: req.user.id,
                characters: []
            });
        }

        // Check if character already exists
        const exists = favorites.characters.some(char => char.name === req.body.name);
        if (exists) {
            return res.status(400).json({ message: 'Character is already in favorites' });
        }

        favorites.characters.push(req.body);
        await favorites.save();
        res.json(favorites.characters);
    } catch (err) {
        console.error('Error adding favorite:', err);
        res.status(500).json({ message: 'Server error while adding favorite' });
    }
});

// Remove a character from favorites
router.delete('/:characterName', auth, async (req, res) => {
    try {
        const favorites = await Favorite.findOne({ userId: req.user.id });
        
        if (!favorites) {
            return res.status(404).json({ message: 'No favorites found for this user' });
        }

        const initialLength = favorites.characters.length;
        favorites.characters = favorites.characters.filter(
            char => char.name !== req.params.characterName
        );

        if (favorites.characters.length === initialLength) {
            return res.status(404).json({ message: 'Character not found in favorites' });
        }

        await favorites.save();
        res.json(favorites.characters);
    } catch (err) {
        console.error('Error removing favorite:', err);
        res.status(500).json({ message: 'Server error while removing favorite' });
    }
});

module.exports = router; 