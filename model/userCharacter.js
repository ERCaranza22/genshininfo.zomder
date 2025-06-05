const mongoose = require('mongoose');

const userCharacterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  characterName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const UserCharacter = mongoose.model('UserCharacter', userCharacterSchema);

module.exports = UserCharacter;
