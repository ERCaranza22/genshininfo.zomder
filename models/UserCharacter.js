const mongoose = require('mongoose');

const userCharacterSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    characterName: {
        type: String,
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create a compound index to ensure uniqueness of userId + characterName combination
userCharacterSchema.index({ userId: 1, characterName: 1 }, { unique: true });

module.exports = mongoose.model('UserCharacter', userCharacterSchema); 