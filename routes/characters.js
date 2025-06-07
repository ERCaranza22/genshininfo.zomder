const express = require('express');
const router = express.Router();
const Character = require('../models/Character');

// Get all characters
router.get('/', async (req, res) => {
    try {
        const characters = await Character.find();
        res.json(characters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single character
router.get('/:id', async (req, res) => {
    try {
        const character = await Character.findById(req.params.id);
        if (character) {
            res.json(character);
        } else {
            res.status(404).json({ message: 'Character not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new character
router.post('/', async (req, res) => {
    const character = new Character({
        name: req.body.name,
        vision: req.body.vision,
        weapon: req.body.weapon,
        rarity: req.body.rarity,
        description: req.body.description,
        imageUrl: req.body.imageUrl
    });

    try {
        const newCharacter = await character.save();
        res.status(201).json(newCharacter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a character
router.patch('/:id', async (req, res) => {
    try {
        const character = await Character.findById(req.params.id);
        if (!character) {
            return res.status(404).json({ message: 'Character not found' });
        }

        if (req.body.name) character.name = req.body.name;
        if (req.body.vision) character.vision = req.body.vision;
        if (req.body.weapon) character.weapon = req.body.weapon;
        if (req.body.rarity) character.rarity = req.body.rarity;
        if (req.body.description) character.description = req.body.description;
        if (req.body.imageUrl) character.imageUrl = req.body.imageUrl;

        const updatedCharacter = await character.save();
        res.json(updatedCharacter);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a character
router.delete('/:id', async (req, res) => {
    try {
        const character = await Character.findById(req.params.id);
        if (!character) {
            return res.status(404).json({ message: 'Character not found' });
        }
        await character.deleteOne();
        res.json({ message: 'Character deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
