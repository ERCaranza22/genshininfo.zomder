const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    vision: {
        type: String,
        required: true
    },
    weapon: {
        type: String,
        required: true
    },
    rarity: {
        type: Number,
        required: true,
        min: 4,
        max: 5
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Character', CharacterSchema); 