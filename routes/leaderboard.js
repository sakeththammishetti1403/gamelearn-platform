const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get global leaderboard
// @route   GET /api/leaderboard/global
// @access  Private (Students can view)
router.get('/global', protect, async (req, res) => {
    try {
        const leaderboard = await Progress.aggregate([
            {
                $group: {
                    _id: '$userId',
                    totalScore: { $sum: '$score' },
                    totalTimeSpent: { $sum: '$timeSpent' },
                    modulesCompleted: {
                        $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    _id: 1,
                    totalScore: 1,
                    totalTimeSpent: 1,
                    modulesCompleted: 1,
                    'user.name': 1,
                    'user.role': 1
                }
            },
            { $match: { 'user.role': 'student' } },
            { $sort: { totalScore: -1, totalTimeSpent: 1 } },
            { $limit: 20 }
        ]);

        // Add rank to each entry
        const rankedLeaderboard = leaderboard.map((entry, index) => ({
            rank: index + 1,
            userId: entry._id,
            name: entry.user.name,
            score: entry.totalScore,
            xp: entry.totalScore * 10, // Assuming 1 score point = 10 XP
            modulesCompleted: entry.modulesCompleted
        }));

        res.json(rankedLeaderboard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get subject-wise leaderboard
// @route   GET /api/leaderboard/subject/:subjectId
// @access  Private
router.get('/subject/:subjectId', protect, async (req, res) => {
    try {
        const { subjectId } = req.params;
        const mongoose = require('mongoose');

        const leaderboard = await Progress.aggregate([
            { $match: { subjectId: new mongoose.Types.ObjectId(subjectId) } },
            {
                $group: {
                    _id: '$userId',
                    totalScore: { $sum: '$score' },
                    totalTimeSpent: { $sum: '$timeSpent' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    _id: 1,
                    totalScore: 1,
                    totalTimeSpent: 1,
                    'user.name': 1,
                    'user.role': 1
                }
            },
            { $match: { 'user.role': 'student' } },
            { $sort: { totalScore: -1, totalTimeSpent: 1 } },
            { $limit: 15 }
        ]);

        const rankedLeaderboard = leaderboard.map((entry, index) => ({
            rank: index + 1,
            name: entry.user.name,
            score: entry.totalScore,
            xp: entry.totalScore * 10
        }));

        res.json(rankedLeaderboard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get weekly leaderboard
// @route   GET /api/leaderboard/weekly
// @access  Private
router.get('/weekly', protect, async (req, res) => {
    try {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const leaderboard = await Progress.aggregate([
            { $match: { updatedAt: { $gte: lastWeek } } },
            {
                $group: {
                    _id: '$userId',
                    weeklyScore: { $sum: '$score' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    _id: 1,
                    weeklyScore: 1,
                    'user.name': 1,
                    'user.role': 1
                }
            },
            { $match: { 'user.role': 'student' } },
            { $sort: { weeklyScore: -1 } },
            { $limit: 10 }
        ]);

        const rankedLeaderboard = leaderboard.map((entry, index) => ({
            rank: index + 1,
            name: entry.user.name,
            score: entry.weeklyScore,
            xp: entry.weeklyScore * 10
        }));

        res.json(rankedLeaderboard);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
