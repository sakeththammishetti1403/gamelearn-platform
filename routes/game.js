const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Game = require('../models/Game');
const Section = require('../models/Section');
const Progress = require('../models/Progress');
const Module = require('../models/Module');
const GameFactory = require('../engine/GameFactory');

// @desc    Submit game result
// @route   POST /api/game/:sectionId/submit
// @access  Private
router.post('/:sectionId/submit', protect, async (req, res) => {
    const { input } = req.body; // input contains game moves/result

    try {
        const section = await Section.findById(req.params.sectionId).populate('gameConfig');

        if (!section || section.type !== 'GAME') {
            return res.status(404).json({ message: 'Game section not found' });
        }

        const gameConfig = section.gameConfig;
        if (!gameConfig) {
            return res.status(500).json({ message: 'Game configuration missing' });
        }

        // Initialize Game Engine
        const gameEngine = GameFactory.createGame(
            gameConfig.gameType,
            gameConfig.rules,
            gameConfig.maxScore,
            gameConfig.passingScore
        );

        // Validate Result
        const result = gameEngine.validate(input);

        // Update Progress
        let progress = await Progress.findOne({
            userId: req.user._id,
            sectionId: section._id,
        });

        if (!progress) {
            return res.status(403).json({ message: 'Section is locked or not started' });
        }

        if (progress.status === 'LOCKED') {
            return res.status(403).json({ message: 'Section is locked' });
        }

        // Update score and attempts
        progress.attempts += 1;
        progress.lastAttemptAt = new Date();

        if (result.score > progress.score) {
            progress.score = result.score;
        }

        if (result.isPassed) {
            // Idempotency: Only set COMPLETED and unlock next if not already done
            if (progress.status !== 'COMPLETED') {
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
            } else {
                // Already completed, just save the new score/attempts
                await progress.save();
            }
        } else {
            await progress.save();
        }

        res.json({
            result,
            nextSectionId: result.isPassed && (await Section.findOne({ moduleId: section.moduleId, order: section.order + 1 }))?._id,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
