const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const CareerTrack = require('../models/CareerTrack');
const Progress = require('../models/Progress');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Module = require('../models/Module');
const Section = require('../models/Section');

// @desc    Get all career tracks
// @route   GET /api/career/tracks
// @access  Private
router.get('/tracks', protect, async (req, res) => {
    try {
        const tracks = await CareerTrack.find({ isActive: true });
        res.json(tracks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single career track with user progress
// @route   GET /api/career/tracks/:id
// @access  Private
router.get('/tracks/:id', protect, async (req, res) => {
    try {
        const track = await CareerTrack.findById(req.params.id)
            .populate('skills.core.subject')
            .populate('skills.supporting.subject')
            .populate('skills.optional.subject');

        if (!track) return res.status(404).json({ message: 'Career track not found' });

        // ======= NEW WEIGHTED READINESS LOGIC =======
        // 1. Core CS Progress (60% weight)
        const allCoreSubjects = await Subject.find({ isCore: true });
        const coreSubjectIds = allCoreSubjects.map(s => s._id);

        const totalCoreSections = await Section.countDocuments({
            moduleId: { $in: await Module.find({ subjectId: { $in: coreSubjectIds }, isCore: true }).distinct('_id') }
        });

        const completedCoreSections = await Progress.countDocuments({
            userId: req.user._id,
            status: 'COMPLETED',
            subjectId: { $in: coreSubjectIds }
        });

        const coreProgress = totalCoreSections > 0 ? (completedCoreSections / totalCoreSections) : 0;

        // 2. Career Specialization Progress (40% weight)
        // Find modules specialized for this career track
        const specModules = await Module.find({
            isCore: false,
            careerTags: { $in: [new RegExp(track.title, 'i'), ...track.title.split(' ')] }
        });
        const specModuleIds = specModules.map(m => m._id);

        const totalSpecSections = await Section.countDocuments({ moduleId: { $in: specModuleIds } });
        const completedSpecSections = await Progress.countDocuments({
            userId: req.user._id,
            status: 'COMPLETED',
            moduleId: { $in: specModuleIds }
        });

        const specProgress = totalSpecSections > 0 ? (completedSpecSections / totalSpecSections) : 0;

        // 3. Final Weighted Score
        const alignmentScore = Math.round((coreProgress * 60) + (specProgress * 40));
        // ============================================

        res.json({
            ...track._doc,
            alignmentScore,
            readinessScore: alignmentScore // Keep for backward compatibility if needed, but UI should use alignment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Enroll in a career track
// @route   POST /api/career/enroll
// @access  Private
router.post('/enroll', protect, async (req, res) => {
    try {
        const { trackId } = req.body;
        const user = await User.findById(req.user._id);

        user.activeCareerTrack = trackId;
        await user.save();

        res.json({ message: 'Enrolled successfully', activeTrack: trackId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Career Discovery Assessment
// @route   POST /api/career/discovery
// @access  Private
router.post('/discovery', protect, async (req, res) => {
    try {
        const { answers } = req.body; // Array of interests/answers

        // Mock logic to suggest tracks based on interests
        // In reality, this would be a more complex matching algorithm
        const interestMap = {
            'coding': ['Software Development Engineer (SDE)', 'Full Stack Developer'],
            'data': ['Data Analyst', 'Data Scientist', 'Machine Learning Engineer'],
            'security': ['Cybersecurity Analyst'],
            'scaling': ['Cloud / DevOps Engineer'],
            'management': ['Product Manager'], // If we add it later
        };

        const suggestedTitles = new Set();
        answers.forEach(a => {
            if (interestMap[a]) interestMap[a].forEach(t => suggestedTitles.add(t));
        });

        const suggestions = await CareerTrack.find({
            title: { $in: Array.from(suggestedTitles) }
        });

        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
