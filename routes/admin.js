const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Module = require('../models/Module');
const Progress = require('../models/Progress');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const subjectCount = await Subject.countDocuments({ isActive: true });
        const moduleCount = await Module.countDocuments({ isActive: true });
        const completedGamesCount = await Progress.countDocuments({
            status: 'COMPLETED',
            attempts: { $gt: 0 }
        });

        res.json({
            users: userCount,
            subjects: subjectCount,
            modules: moduleCount,
            gamesPlayed: completedGamesCount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Enable/Disable subject
// @route   PATCH /api/admin/subjects/:id/status
// @access  Admin
router.patch('/subjects/:id/status', protect, admin, async (req, res) => {
    const { isActive } = req.body;

    try {
        const subject = await Subject.findById(req.params.id);

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        subject.isActive = isActive;
        await subject.save();

        res.json({ message: `Subject ${isActive ? 'enabled' : 'disabled'}`, subject });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Enable/Disable module
// @route   PATCH /api/admin/modules/:id/status
// @access  Admin
router.patch('/modules/:id/status', protect, admin, async (req, res) => {
    const { isActive } = req.body;

    try {
        const module = await Module.findById(req.params.id);

        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }

        module.isActive = isActive;
        await module.save();

        res.json({ message: `Module ${isActive ? 'enabled' : 'disabled'}`, module });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
