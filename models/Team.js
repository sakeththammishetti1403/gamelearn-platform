const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    captain: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    banner: { type: String },
    stats: {
        totalWins: { type: Number, default: 0 },
        totalScore: { type: Number, default: 0 }
    },
    campus: { type: String } // College/Organization grouping
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
