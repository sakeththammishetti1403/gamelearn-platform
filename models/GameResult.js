const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
    roomCode: {
        type: String,
        required: true,
        index: true
    },
    players: [{
        userId: String,
        name: String,
        score: Number,
        accuracy: Number
    }],
    winner: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    questionCount: {
        type: Number,
        default: 5
    }
});

module.exports = mongoose.model('GameResult', gameResultSchema);
