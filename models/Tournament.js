const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    participants: [{
        participantId: { type: mongoose.Schema.Types.ObjectId, refPath: 'participantType' },
        participantType: { type: String, enum: ['User', 'Team'] }
    }],
    brackets: [{
        round: Number,
        matchId: String,
        competitors: [mongoose.Schema.Types.ObjectId],
        winner: mongoose.Schema.Types.ObjectId
    }],
    prizePool: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);
