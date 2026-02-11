const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Subject = require('../models/Subject');
const Module = require('../models/Module');
const Section = require('../models/Section');
const Progress = require('../models/Progress');
const CareerTrack = require('../models/CareerTrack');
const { checkModuleCompletion } = require('../services/completionService');
const catchAsync = require('../utils/catchAsync');
const cacheService = require('../services/cacheService');

// @desc    Get all subjects
// @route   GET /api/learning/subjects
// @access  Private
router.get('/subjects', protect, catchAsync(async (req, res) => {
    const cacheKey = 'learning:subjects';
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    const subjects = await Subject.find({ isActive: true });
    await cacheService.set(cacheKey, subjects, 3600); // 1 hour
    res.json(subjects);
}));

// @desc    Get modules for a subject
// @route   GET /api/learning/modules/:subjectId
// @access  Private
router.get('/modules/:subjectId', protect, catchAsync(async (req, res) => {
    const { subjectId } = req.params;
    const cacheKey = `learning:modules:${subjectId}`;
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    const modules = await Module.find({
        subjectId: req.params.subjectId,
        isActive: true
    }).sort({ order: 1 });

    const modulesWithGating = modules.map(m => ({
        ...m.toObject(),
        isLocked: false,
        lockReason: ''
    }));

    await cacheService.set(cacheKey, modulesWithGating, 3600); // 1 hour
    res.json(modulesWithGating);
}));

// @desc    Get sections for a module with user progress
// @route   GET /api/learning/sections/:moduleId
// @access  Private
router.get('/sections/:moduleId', protect, catchAsync(async (req, res) => {
    const module = await Module.findById(req.params.moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    const sections = await Section.find({ moduleId: req.params.moduleId })
        .sort({ order: 1 })
        .populate('gameConfig');

    const progress = await Progress.find({
        userId: req.user._id,
        moduleId: req.params.moduleId,
    });

    const sectionsWithProgress = sections.map(section => {
        const userProgress = progress.find(p => p.sectionId.toString() === section._id.toString());
        return {
            ...section.toObject(),
            userStatus: userProgress ? userProgress.status : 'UNLOCKED',
            userScore: userProgress ? userProgress.score : 0,
        };
    });

    res.json(sectionsWithProgress);
}));

// @desc    Mark content section as completed
// @route   POST /api/learning/section/:sectionId/complete
// @access  Private
router.post('/section/:sectionId/complete', protect, catchAsync(async (req, res) => {
    const section = await Section.findById(req.params.sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    if (section.type !== 'CONTENT') {
        return res.status(400).json({ message: 'Only content sections can be manually completed' });
    }

    let progress = await Progress.findOne({
        userId: req.user._id,
        sectionId: req.params.sectionId,
    });

    if (!progress) {
        const module = await Module.findById(section.moduleId);
        progress = await Progress.create({
            userId: req.user._id,
            subjectId: module.subjectId,
            moduleId: section.moduleId,
            sectionId: req.params.sectionId,
            status: 'UNLOCKED'
        });
    }

    if (progress.status === 'COMPLETED') {
        const nextSection = await Section.findOne({ moduleId: section.moduleId, order: section.order + 1 });
        return res.json({ message: 'Already completed', nextSectionId: nextSection ? nextSection._id : null });
    }

    progress.status = 'COMPLETED';
    progress.completedAt = new Date();
    await progress.save();

    const nextSection = await Section.findOne({ moduleId: section.moduleId, order: section.order + 1 });
    if (nextSection) {
        let nextProgress = await Progress.findOne({ userId: req.user._id, sectionId: nextSection._id });
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

    await checkModuleCompletion(req.user._id, section.moduleId);
    res.json({ message: 'Section completed', nextSectionId: nextSection ? nextSection._id : null });
}));

// @desc    Diagnostic health check
// @route   GET /api/learning/debug/health
// @access  Private
router.get('/debug/health', protect, (req, res) => {
    res.json({
        status: 'ok',
        version: '2.0.2-nuclear-debug',
        timestamp: new Date().toISOString()
    });
});

// @desc    Get student dashboard stats
// @route   GET /api/learning/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        console.log(`[NUCLEAR-DEBUG] Hit /api/learning/stats - User: ${req.user._id}`);
        const cacheKey = `learning:stats:${req.user._id}`;
        // Short cache for stats as they change frequently
        const cachedData = await cacheService.get(cacheKey);
        if (cachedData) {
            // Update version if needed or just return
            return res.json(cachedData);
        }

        const progressDocs = await Progress.find({ userId: req.user._id });
        const completedProgress = progressDocs.filter(p => p.status === 'COMPLETED');

        const totalPoints = progressDocs.reduce((sum, p) => sum + (p.score || 0), 0);
        const totalMinutes = progressDocs.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
        const hoursLearned = parseFloat((totalMinutes / 60).toFixed(1));

        let coreLevels = 0;
        let specLevels = 0;
        let corePts = 0;
        let specPts = 0;

        const moduleIds = [...new Set(progressDocs.filter(p => p.moduleId).map(p => p.moduleId.toString()))];
        const modules = await Module.find({ _id: { $in: moduleIds } });

        for (const modId of moduleIds) {
            const mod = modules.find(m => m._id.toString() === modId);
            if (!mod) continue;

            const totalInMod = await Section.countDocuments({ moduleId: modId });
            const completedInMod = completedProgress.filter(p => p.moduleId && p.moduleId.toString() === modId).length;
            const scoreInMod = progressDocs
                .filter(p => p.moduleId && p.moduleId.toString() === modId)
                .reduce((sum, p) => sum + (p.score || 0), 0);

            if (mod.isCore) {
                corePts += scoreInMod;
                if (totalInMod > 0 && totalInMod === completedInMod) coreLevels++;
            } else {
                specPts += scoreInMod;
                if (totalInMod > 0 && totalInMod === completedInMod) specLevels++;
            }
        }

        const completedIds = completedProgress.map(p => p.sectionId);
        const gamesPlayed = await Section.countDocuments({ _id: { $in: completedIds }, type: 'GAME' });

        const completionDates = progressDocs
            .filter(p => p.completedAt)
            .map(p => new Date(p.completedAt).toDateString());
        const uniqueDates = [...new Set(completionDates)].map(d => new Date(d)).sort((a, b) => b - a);

        let streak = 0;
        if (uniqueDates.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil(Math.abs(today - uniqueDates[0]) / (1000 * 60 * 60 * 24));
            if (diffDays <= 1) {
                streak = 1;
                for (let i = 1; i < uniqueDates.length; i++) {
                    if (Math.ceil(Math.abs(uniqueDates[i - 1] - uniqueDates[i]) / (1000 * 60 * 60 * 24)) === 1) streak++;
                    else break;
                }
            }
        }

        const totalAttempts = progressDocs.reduce((sum, p) => sum + (p.attempts || 0), 0);
        const accuracy = totalAttempts > 0 ? Math.round((completedProgress.length / totalAttempts) * 100) : 0;

        const allSubjects = await Subject.find({ isActive: true });
        const skillDist = await Promise.all(allSubjects.map(async (subj) => {
            const subjScore = progressDocs
                .filter(p => p.subjectId && p.subjectId.toString() === subj._id.toString())
                .reduce((sum, p) => sum + (p.score || 0), 0);
            return { subject: subj.title, score: subjScore, isCore: subj.isCore };
        }));

        const statsResponse = {
            v: '2.0.2-nuclear-ready',
            levelsCompleted: coreLevels + specLevels,
            fundamentalLevelsCompleted: coreLevels,
            pathSpecificLevelsCompleted: specLevels,
            dayStreak: streak,
            totalPoints: corePts + specPts,
            fundamentalPoints: corePts,
            pathSpecificPoints: specPts,
            hoursLearned,
            gamesPlayed,
            accuracy,
            totalAttempts,
            skillDistribution: skillDist
        };

        await cacheService.set(cacheKey, statsResponse, 60); // 1 minute
        res.json(statsResponse);
    } catch (err) {
        console.error('[NUCLEAR-DEBUG] ERROR in /api/learning/stats:', err);
        res.status(500).json({ message: err.message, stack: err.stack, diagnostic: 'Stats failure' });
    }
});

// @desc    Get detailed progress for Progress page
// @route   GET /api/learning/detailed-progress
// @access  Private
router.get('/detailed-progress', protect, async (req, res) => {
    try {
        console.log(`[NUCLEAR-DEBUG] Hit /api/learning/detailed-progress - User: ${req.user._id}`);
        const subjects = await Subject.find({ isActive: true });
        const detailed = await Promise.all(subjects.map(async (subject) => {
            const modules = await Module.find({ subjectId: subject._id }).sort({ order: 1 });
            const moduleDetails = await Promise.all(modules.map(async (mod) => {
                const total = await Section.countDocuments({ moduleId: mod._id });
                const completed = await Progress.countDocuments({ userId: req.user._id, moduleId: mod._id, status: 'COMPLETED' });
                const unlocked = await Progress.countDocuments({ userId: req.user._id, moduleId: mod._id, status: 'UNLOCKED' });
                const last = await Progress.findOne({ userId: req.user._id, moduleId: mod._id }).sort({ updatedAt: -1 }).populate('sectionId');

                return {
                    _id: mod._id,
                    title: mod.title,
                    order: mod.order,
                    isCore: mod.isCore,
                    isLocked: false,
                    lockReason: '',
                    totalSections: total,
                    completedSectionsCount: completed,
                    unlockedSectionsCount: unlocked,
                    progress: total > 0 ? Math.round((completed / total) * 100) : 0,
                    lastSection: last && last.sectionId ? last.sectionId.title : 'Not started'
                };
            }));

            const sTotal = moduleDetails.reduce((sum, m) => sum + m.totalSections, 0);
            const sCompleted = moduleDetails.reduce((sum, m) => sum + m.completedSectionsCount, 0);

            return {
                _id: subject._id,
                title: subject.title,
                isCore: subject.isCore,
                image: subject.image,
                modules: moduleDetails,
                overallProgress: sTotal > 0 ? Math.round((sCompleted / sTotal) * 100) : 0
            };
        }));
        res.json(detailed);
    } catch (err) {
        console.error('[NUCLEAR-DEBUG] ERROR in /api/learning/detailed-progress:', err);
        res.status(500).json({ message: err.message, stack: err.stack, diagnostic: 'Detailed progress failure' });
    }
});

// @desc    Get learning path (subjects with progress)
// @route   GET /api/learning/learning-path
// @access  Private
router.get('/learning-path', protect, async (req, res) => {
    try {
        console.log(`[NUCLEAR-DEBUG] Hit /api/learning/learning-path - User: ${req.user._id}`);
        const subjects = await Subject.find({ isActive: true });
        const path = await Promise.all(subjects.map(async (subject) => {
            const modules = await Module.find({ subjectId: subject._id }).sort({ order: 1 });
            const total = await Section.countDocuments({ moduleId: { $in: modules.map(m => m._id) } });
            const completed = await Progress.countDocuments({ userId: req.user._id, subjectId: subject._id, status: 'COMPLETED' });

            let current = modules.length > 0 ? modules[0] : null;
            for (const mod of modules) {
                const modTotal = await Section.countDocuments({ moduleId: mod._id });
                const modCompleted = await Progress.countDocuments({ userId: req.user._id, moduleId: mod._id, status: 'COMPLETED' });
                if (modCompleted < modTotal) {
                    current = mod;
                    break;
                }
            }

            return {
                _id: subject._id,
                title: subject.title,
                isCore: subject.isCore,
                description: subject.description,
                image: subject.image || 'https://via.placeholder.com/150',
                progress: total > 0 ? Math.round((completed / total) * 100) : 0,
                currentModule: current ? current.title : 'Completed',
                moduleOrder: current ? current.order : 1
            };
        }));
        res.json(path);
    } catch (err) {
        console.error('[NUCLEAR-DEBUG] ERROR in /api/learning/learning-path:', err);
        res.status(500).json({ message: err.message, stack: err.stack, diagnostic: 'Learning path failure' });
    }
});

// @desc    Get activity heatmap data (last 365 days)
// @route   GET /api/learning/heatmap
// @access  Private
router.get('/heatmap', protect, catchAsync(async (req, res) => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const activity = await Progress.aggregate([
        { $match: { userId: req.user._id, status: 'COMPLETED', completedAt: { $gte: oneYearAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } }, count: { $sum: 1 } } },
        { $sort: { "_id": 1 } }
    ]);
    res.json(activity);
}));

module.exports = router;
