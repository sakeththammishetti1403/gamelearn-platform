const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Subject = require('../models/Subject');
const Module = require('../models/Module');
const Section = require('../models/Section');
const Progress = require('../models/Progress');
const Game = require('../models/Game');

// @desc    Get all subjects
// @route   GET /api/learning/subjects
// @access  Private
router.get('/subjects', protect, async (req, res) => {
    try {
        const subjects = await Subject.find({ isActive: true });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get modules for a subject
// @route   GET /api/learning/modules/:subjectId
// @access  Private
router.get('/modules/:subjectId', protect, async (req, res) => {
    try {
        const modules = await Module.find({
            subjectId: req.params.subjectId,
            isActive: true
        }).sort({ order: 1 });
        res.json(modules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get sections for a module with user progress
// @route   GET /api/learning/sections/:moduleId
// @access  Private
router.get('/sections/:moduleId', protect, async (req, res) => {
    try {
        const sections = await Section.find({ moduleId: req.params.moduleId })
            .sort({ order: 1 })
            .populate('gameConfig');

        // Fetch user progress for these sections
        const progress = await Progress.find({
            userId: req.user._id,
            moduleId: req.params.moduleId,
        });

        // Map progress to sections
        const sectionsWithProgress = sections.map(section => {
            const userProgress = progress.find(p => p.sectionId.toString() === section._id.toString());
            return {
                ...section.toObject(),
                userStatus: userProgress ? userProgress.status : 'LOCKED',
                userScore: userProgress ? userProgress.score : 0,
            };
        });

        // Unlock the first section if no progress exists
        if (sectionsWithProgress.length > 0 && !progress.length) {
            sectionsWithProgress[0].userStatus = 'UNLOCKED';
            // Create initial progress record
            const module = await Module.findById(req.params.moduleId);
            if (module) {
                await Progress.create({
                    userId: req.user._id,
                    subjectId: module.subjectId,
                    moduleId: req.params.moduleId,
                    sectionId: sectionsWithProgress[0]._id,
                    status: 'UNLOCKED'
                });
            }
        }

        res.json(sectionsWithProgress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Mark content section as completed
// @route   POST /api/learning/section/:sectionId/complete
// @access  Private
router.post('/section/:sectionId/complete', protect, async (req, res) => {
    try {
        const section = await Section.findById(req.params.sectionId);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        if (section.type !== 'CONTENT') {
            return res.status(400).json({ message: 'Only content sections can be manually completed' });
        }

        // Update or create progress
        let progress = await Progress.findOne({
            userId: req.user._id,
            sectionId: req.params.sectionId,
        });

        if (!progress) {
            // If no progress record exists, it means the user hasn't unlocked this section yet.
            return res.status(403).json({ message: 'Section is locked or not started' });
        }

        if (progress.status === 'LOCKED') {
            return res.status(403).json({ message: 'Section is locked' });
        }

        // Idempotency: If already completed, just return success
        if (progress.status === 'COMPLETED') {
            // Find next section to return consistent response
            const nextSection = await Section.findOne({
                moduleId: section.moduleId,
                order: section.order + 1,
            });
            return res.json({ message: 'Section already completed', nextSectionId: nextSection ? nextSection._id : null });
        }

        progress.status = 'COMPLETED';
        progress.completedAt = new Date();
        await progress.save();

        // Unlock next section
        const nextSection = await Section.findOne({
            moduleId: section.moduleId,
            order: section.order + 1,
        });

        if (nextSection) {
            let nextProgress = await Progress.findOne({
                userId: req.user._id,
                sectionId: nextSection._id,
            });

            if (!nextProgress) {
                const module = await Module.findById(section.moduleId);
                await Progress.create({
                    userId: req.user._id,
                    subjectId: module.subjectId,
                    moduleId: section.moduleId,
                    sectionId: nextSection._id,
                    status: 'UNLOCKED'
                });
            } else if (nextProgress.status === 'LOCKED') {
                nextProgress.status = 'UNLOCKED';
                await nextProgress.save();
            }
        }

        res.json({ message: 'Section completed', nextSectionId: nextSection ? nextSection._id : null });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get student dashboard stats
// @route   GET /api/learning/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'User not found' });

        const progress = await Progress.find({ userId: req.user._id });

        // Total Points
        const totalPoints = progress.reduce((sum, p) => sum + (p.score || 0), 0);

        // Hours Learned (timeSpent is in minutes)
        const totalMinutes = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
        const hoursLearned = parseFloat((totalMinutes / 60).toFixed(1));

        // Levels Completed (Modules where all sections are COMPLETED)
        const completedSections = progress.filter(p => p.status === 'COMPLETED');
        const moduleIds = [...new Set(completedSections.filter(p => p.moduleId).map(p => p.moduleId.toString()))];

        let levelsCompleted = 0;
        for (const moduleId of moduleIds) {
            const totalSectionsInModule = await Section.countDocuments({ moduleId });
            const completedSectionsInModule = completedSections.filter(p => p.moduleId && p.moduleId.toString() === moduleId).length;
            if (totalSectionsInModule > 0 && totalSectionsInModule === completedSectionsInModule) {
                levelsCompleted++;
            }
        }

        // Games Played (Count of COMPLETED sections of type GAME)
        const completedSectionIds = completedSections.map(p => p.sectionId);
        const gamesPlayed = await Section.countDocuments({
            _id: { $in: completedSectionIds },
            type: 'GAME'
        });

        // Day Streak
        const completionDates = progress
            .filter(p => p.completedAt)
            .map(p => new Date(p.completedAt).toDateString());

        const uniqueDates = [...new Set(completionDates)].map(d => new Date(d)).sort((a, b) => b - a);

        let streak = 0;
        let today = new Date();
        today.setHours(0, 0, 0, 0);

        if (uniqueDates.length > 0) {
            let lastDate = uniqueDates[0];
            const diffTime = Math.abs(today - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) { // Today or Yesterday
                streak = 1;
                for (let i = 1; i < uniqueDates.length; i++) {
                    const d1 = uniqueDates[i - 1];
                    const d2 = uniqueDates[i];
                    const diff = Math.abs(d1 - d2);
                    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                    if (days === 1) {
                        streak++;
                    } else {
                        break;
                    }
                }
            }
        }

        res.json({
            levelsCompleted,
            dayStreak: streak,
            totalPoints,
            hoursLearned,
            gamesPlayed
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get detailed progress for Progress page
// @route   GET /api/learning/detailed-progress
// @access  Private
router.get('/detailed-progress', protect, async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'User not found' });

        const subjects = await Subject.find({ isActive: true });
        const detailedProgress = await Promise.all(subjects.map(async (subject) => {
            const modules = await Module.find({ subjectId: subject._id }).sort({ order: 1 });

            const moduleProgress = await Promise.all(modules.map(async (module) => {
                const totalSections = await Section.countDocuments({ moduleId: module._id });
                const completedSections = await Progress.countDocuments({
                    userId: req.user._id,
                    moduleId: module._id,
                    status: 'COMPLETED'
                });

                const lastAccessedSection = await Progress.findOne({
                    userId: req.user._id,
                    moduleId: module._id
                }).sort({ updatedAt: -1 }).populate('sectionId');

                return {
                    _id: module._id,
                    title: module.title,
                    order: module.order,
                    totalSections,
                    completedSections,
                    progress: totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0,
                    lastSection: lastAccessedSection && lastAccessedSection.sectionId ? lastAccessedSection.sectionId.title : 'Not started'
                };
            }));

            const totalSubjectSections = moduleProgress.reduce((sum, m) => sum + m.totalSections, 0);
            const completedSubjectSections = moduleProgress.reduce((sum, m) => sum + m.completedSections, 0);

            return {
                _id: subject._id,
                title: subject.title,
                image: subject.image,
                modules: moduleProgress,
                overallProgress: totalSubjectSections > 0 ? Math.round((completedSubjectSections / totalSubjectSections) * 100) : 0
            };
        }));

        res.json(detailedProgress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get learning path (subjects with progress)
// @route   GET /api/learning/learning-path
// @access  Private
router.get('/learning-path', protect, async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'User not found' });

        const subjects = await Subject.find({ isActive: true });
        const learningPath = await Promise.all(subjects.map(async (subject) => {
            const modules = await Module.find({ subjectId: subject._id }).sort({ order: 1 });
            const moduleIds = modules.map(m => m._id);
            const totalSections = moduleIds.length > 0 ? await Section.countDocuments({ moduleId: { $in: moduleIds } }) : 0;

            const progress = await Progress.find({
                userId: req.user._id,
                subjectId: subject._id,
                status: 'COMPLETED'
            });

            const completedCount = progress.length;
            const progressPercent = totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;

            // Find current module (first one not fully completed)
            let currentModule = modules.length > 0 ? modules[0] : null;
            for (const module of modules) {
                const moduleSections = await Section.countDocuments({ moduleId: module._id });
                const moduleCompleted = await Progress.countDocuments({
                    userId: req.user._id,
                    moduleId: module._id,
                    status: 'COMPLETED'
                });
                if (moduleCompleted < moduleSections) {
                    currentModule = module;
                    break;
                }
            }

            return {
                _id: subject._id,
                title: subject.title,
                description: subject.description,
                image: subject.image || 'https://via.placeholder.com/150',
                progress: progressPercent,
                currentModule: currentModule ? currentModule.title : 'N/A',
                moduleOrder: currentModule ? currentModule.order : 1
            };
        }));

        res.json(learningPath);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
