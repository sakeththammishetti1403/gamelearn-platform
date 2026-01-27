const express = require('express');
const router = express.Router();
const { protect, instructor } = require('../middleware/authMiddleware');
const Subject = require('../models/Subject');
const Module = require('../models/Module');
const Section = require('../models/Section');
const Game = require('../models/Game');

// @desc    Create new subject
// @route   POST /api/instructor/subjects
// @access  Instructor/Admin
router.post('/subjects', protect, instructor, async (req, res) => {
    const { title, description } = req.body;

    try {
        const subject = await Subject.create({
            title,
            description,
        });

        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create new module
// @route   POST /api/instructor/modules
// @access  Instructor/Admin
router.post('/modules', protect, instructor, async (req, res) => {
    const { subjectId, title, order } = req.body;

    try {
        const module = await Module.create({
            subjectId,
            title,
            order,
        });

        res.status(201).json(module);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create new section
// @route   POST /api/instructor/sections
// @access  Instructor/Admin
router.post('/sections', protect, instructor, async (req, res) => {
    const { moduleId, type, order, title, contentRef, gameType, gameRules, maxScore, passingScore } = req.body;

    try {
        let sectionData = {
            moduleId,
            type,
            order,
            title,
        };

        if (type === 'CONTENT') {
            sectionData.contentRef = contentRef || {};
        } else if (type === 'GAME') {
            // Create game config
            const game = await Game.create({
                gameType,
                title: title + ' Game',
                rules: gameRules || {},
                maxScore,
                passingScore,
            });
            sectionData.gameConfig = game._id;
        }

        const section = await Section.create(sectionData);

        res.status(201).json(section);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update section content
// @route   PUT /api/instructor/sections/:id
// @access  Instructor/Admin
router.put('/sections/:id', protect, instructor, async (req, res) => {
    const { title, contentRef, gameRules, maxScore, passingScore } = req.body;

    try {
        const section = await Section.findById(req.params.id).populate('gameConfig');

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        if (title) section.title = title;

        if (section.type === 'CONTENT' && contentRef) {
            section.contentRef = contentRef;
        }

        if (section.type === 'GAME' && section.gameConfig) {
            const game = await Game.findById(section.gameConfig._id);
            if (gameRules) game.rules = gameRules;
            if (maxScore) game.maxScore = maxScore;
            if (passingScore) game.passingScore = passingScore;
            await game.save();
        }

        await section.save();

        res.json(section);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
