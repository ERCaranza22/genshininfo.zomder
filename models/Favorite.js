const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    characters: [{
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        element: {
            type: String,
            required: true
        },
        stars: {
            type: String,
            required: true
        },
        weapon: {
            type: String,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
favoriteSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Favorite', favoriteSchema); 