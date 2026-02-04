const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isCore: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
        default: '/images/subjects/default.png',
    },
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
