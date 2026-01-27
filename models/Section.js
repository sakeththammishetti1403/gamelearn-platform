const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true,
    },
    type: {
        type: String,
        enum: ['CONTENT', 'GAME'],
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    // For CONTENT type
    contentRef: {
        type: Object, // Can store static content or reference to external content
        default: null,
    },
    // For GAME type
    gameConfig: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        default: null,
    },
}, { timestamps: true });

module.exports = mongoose.model('Section', sectionSchema);
