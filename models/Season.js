const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'ended'], default: 'active' },
    rewards: [{
        tier: String,
        badgeId: String,
        xpBonus: Number
    }]
}, { timestamps: true });

module.exports = mongoose.model('Season', seasonSchema);
