const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);
