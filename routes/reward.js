const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Reward = require('../models/Reward');
const Module = require('../models/Module');
const User = require('../models/User');
const { generateCertificatePDF } = require('../services/certificateService');

// @desc    Get all rewards for current user
// @route   GET /api/reward/my-rewards
// @access  Private
router.get('/my-rewards', protect, async (req, res) => {
    try {
        const rewards = await Reward.find({ userId: req.user._id })
            .populate('moduleId', 'title')
            .sort({ createdAt: -1 });
        res.json(rewards);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Download certificate as PDF
// @route   GET /api/reward/certificate/:rewardId/download
// @access  Private
router.get('/certificate/:rewardId/download', protect, async (req, res) => {
    try {
        const reward = await Reward.findOne({
            _id: req.params.rewardId,
            userId: req.user._id
        }).populate('moduleId', 'title');

        if (!reward || !reward.certificateIssued) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        const user = req.user;
        const moduleTitle = reward.moduleId.title;

        // Generate PDF Buffer
        const pdfBuffer = await generateCertificatePDF({
            studentName: user.name,
            courseName: moduleTitle,
            date: reward.createdAt
        });

        // Send PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Certificate_${moduleTitle.replace(/\s+/g, '_')}.pdf`);
        res.send(pdfBuffer);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error generating certificate' });
    }
});

module.exports = router;
