const express = require('express');
const router = express.Router();
const UserCharacter = require('../models/UserCharacter');
const { isAuthenticated } = require('../middleware/auth');

// Get all characters
router.get('/', async (req, res) => {
    try {
        // This would typically come from a database, but for now we'll return static data
        const characters = [
            {
                id: 'albedo',
                name: 'Albedo',
                element: 'Geo',
                weapon: 'Sword',
                rarity: 5,
                iconPath: '/assets/characters/icon/Albedo_Icon.png',
                elementIconPath: '/assets/elements/geo-element.png',
                wishArtPath: '/assets/characters/wish/Albedo.png'
            },
            // Add more characters here...
        ];
        
        res.json(characters);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching characters', error: err.message });
    }
});

// Get user's favorite characters
router.get('/favorites', isAuthenticated, async (req, res) => {
    try {
        const favorites = await UserCharacter.find({ userId: req.session.user.id })
            .select('characterName -_id')
            .lean();
            
        res.json({ favorites: favorites.map(f => f.characterName) });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching favorites', error: err.message });
    }
});

// Add a character to favorites
router.post('/favorites/add', isAuthenticated, async (req, res) => {
    const { characterId } = req.body;
    if (!characterId) {
        return res.status(400).json({ message: 'Character ID is required' });
    }

    try {
        // Check if character already exists for user
        const existing = await UserCharacter.findOne({ 
            userId: req.session.user.id, 
            characterName: characterId 
        });
        
        if (existing) {
            return res.status(400).json({ message: 'Character already in favorites' });
        }

        const newFavorite = new UserCharacter({
            userId: req.session.user.id,
            characterName: characterId
        });
        await newFavorite.save();

        res.json({ message: 'Character added to favorites successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error adding to favorites', error: err.message });
    }
});

// Remove a character from favorites
router.post('/favorites/remove', isAuthenticated, async (req, res) => {
    const { characterId } = req.body;
    if (!characterId) {
        return res.status(400).json({ message: 'Character ID is required' });
    }

    try {
        const deleted = await UserCharacter.findOneAndDelete({ 
            userId: req.session.user.id, 
            characterName: characterId 
        });
        
        if (!deleted) {
            return res.status(404).json({ message: 'Character not found in favorites' });
        }

        res.json({ message: 'Character removed from favorites successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error removing from favorites', error: err.message });
    }
});

module.exports = router;
