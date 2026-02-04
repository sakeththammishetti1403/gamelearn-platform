const mongoose = require('mongoose');

const careerTrackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    bestFor: {
        type: String,
        required: true
    },
    responsibilities: [{
        type: String
    }],
    skills: {
        core: [{
            subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
            importance: { type: String, default: 'Critical' }
        }],
        supporting: [{
            subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
            importance: { type: String, default: 'Important' }
        }],
        optional: [{
            subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
            importance: { type: String, default: 'Bonus' }
        }]
    },
    roadmap: [{
        stage: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            required: true
        },
        milestones: [String],
        estimatedTime: String
    }],
    opportunities: {
        roles: [String],
        internships: [String],
        freelance: String,
        growth: String
    },
    insights: {
        marketDemand: {
            type: String,
            enum: ['High', 'Medium', 'Low'],
            default: 'Medium'
        },
        salaryRange: String,
        techStack: [String]
    },
    myths: [{
        myth: String,
        reality: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CareerTrack', careerTrackSchema);
