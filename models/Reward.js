const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true,
    },
    badgeAwarded: {
        type: Boolean,
        default: false,
    },
    certificateIssued: {
        type: String, // URL or ID of the certificate
        default: null,
    },
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);
