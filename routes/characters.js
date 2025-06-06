const express = require('express');
const router = express.Router();
const UserCharacter = require('../models/UserCharacter');
const { isAuthenticated } = require('../middleware/auth');

// Get all characters for the logged-in user
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const characters = await UserCharacter.find({ userId: req.session.user.id });
        res.json({ characters });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching characters', error: err.message });
    }
});

// Add a new character for the logged-in user
router.post('/add', isAuthenticated, async (req, res) => {
    const { characterName } = req.body;
    if (!characterName) {
        return res.status(400).json({ message: 'Character name is required' });
    }

    try {
        // Check if character already exists for user
        const existing = await UserCharacter.findOne({ userId: req.session.user.id, characterName });
        if (existing) {
            return res.status(400).json({ message: 'Character already added' });
        }

        const newCharacter = new UserCharacter({
            userId: req.session.user.id,
            characterName
        });
        await newCharacter.save();

        res.json({ message: 'Character added successfully', character: newCharacter });
    } catch (err) {
        res.status(500).json({ message: 'Error adding character', error: err.message });
    }
});

// Remove a character for the logged-in user
router.post('/remove', isAuthenticated, async (req, res) => {
    const { characterName } = req.body;
    if (!characterName) {
        return res.status(400).json({ message: 'Character name is required' });
    }

    try {
        const deleted = await UserCharacter.findOneAndDelete({ userId: req.session.user.id, characterName });
        if (!deleted) {
            return res.status(404).json({ message: 'Character not found' });
        }

        res.json({ message: 'Character removed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error removing character', error: err.message });
    }
});

module.exports = router;
