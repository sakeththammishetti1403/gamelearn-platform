const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        sparse: true // Allow null for users without email (GitHub edge case)
    },
    password: {
        type: String,
        required: false, // Not required for OAuth users
    },
    // OAuth Fields
    authProvider: {
        type: String,
        enum: ['local', 'google', 'github', 'linkedin'],
        default: 'local'
    },
    providerId: {
        type: String,
        sparse: true // Unique per provider
    },
    avatar: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student',
    },
    activeCareerTrack: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CareerTrack'
    },
    careerInterests: [String],
    // Arena 2.0 Competitive Fields
    xp: { type: Number, default: 0 },
    skillRating: { type: Number, default: 1000 }, // Base ELO-like rating
    gamesPlayed: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    rank: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master'],
        default: 'Bronze'
    },
}, { timestamps: true });

// Hash password before saving (only for local auth)
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    // OAuth users don't have passwords
    if (!this.password) {
        return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
