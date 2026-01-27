const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    gameType: {
        type: String,
        required: true, // e.g., 'tic-tac-toe', 'sudoku'
    },
    title: {
        type: String,
        required: true
    },
    rules: {
        type: Object, // JSON object for game-specific rules
        default: {},
    },
    maxScore: {
        type: Number,
        required: true,
    },
    passingScore: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
