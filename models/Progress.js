const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true,
    },
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true,
    },
    status: {
        type: String,
        enum: ['LOCKED', 'UNLOCKED', 'COMPLETED'],
        default: 'LOCKED',
    },
    score: {
        type: Number,
        default: 0,
    },
    attempts: {
        type: Number,
        default: 0,
    },
    lastAttemptAt: {
        type: Date,
        default: null,
    },
    completedAt: {
        type: Date,
        default: null,
    },
    timeSpent: {
        type: Number,
        default: 0, // in minutes
    },
}, { timestamps: true });

// Compound index to ensure unique progress record per user per section
progressSchema.index({ userId: 1, sectionId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
