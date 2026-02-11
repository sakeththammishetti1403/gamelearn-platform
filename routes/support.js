const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { protect } = require('../middleware/authMiddleware');
const catchAsync = require('../utils/catchAsync');

// Mock transporter for dev
const transporter = nodemailer.createTransport({
    service: 'gmail', // Defaulting to Gmail, user should override in .env
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// @desc    Send support email
// @route   POST /api/support/email
// @access  Public
router.post('/email', catchAsync(async (req, res) => {
    console.log(`Forwarding support request to: 22211a05v1@bvrit.ac.in`);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: '22211a05v1@bvrit.ac.in',
        replyTo: email,
        subject: `[LevelUpED Support] ${subject}`,
        text: `From: ${email}\n\nMessage:\n${message}`
    };

    try {
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
        } else {
            console.warn('⚠️ [SUPPORT] Email credentials missing. Logging to console instead.');
            console.log('--- MOCK EMAIL HANDLING ---');
            console.log(`From: ${email}`);
            console.log(`Subject: ${subject}`);
            console.log(`Message: ${message}`);
            console.log('---------------------------');
        }
        res.json({ message: 'Support ticket created! We will contact you shortly.' });
    } catch (error) {
        console.error('❌ [SUPPORT] Mail error:', error);
        res.status(500).json({ message: 'Failed to send support email. Please try again later.' });
    }
}));

// @desc    AI Tutor Chat
// @route   POST /api/support/chat
// @access  Private
router.post('/chat', protect, catchAsync(async (req, res) => {
    const { message, chatHistory } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    // In a real app, you would use OpenAI API here:
    // const response = await openai.chat.completions.create({ ... });

    // Simulating AI Response for now to ensure flow works
    console.log(`🤖 AI Tutor received: ${message}`);

    // Crafting a tutor-like response
    let aiResponse = "I'm your LevelUpED AI tutor. How can I help you unlock your next level today?";

    if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
        aiResponse = `Hello ${req.user.name}! I'm ready to help you unlock the next level of your learning journey. What are we studying today?`;
    } else if (message.toLowerCase().includes('points') || message.toLowerCase().includes('score')) {
        aiResponse = "You can earn Knowledge Points by completing courses and winning games in the Multiplayer Arena. This is the key to Unlocking new Levels!";
    } else if (message.toLowerCase().includes('locked')) {
        aiResponse = "Some content might be locked. Make sure you've completed the previous sections in the module to unlock it!";
    } else {
        aiResponse = "That's an interesting question! As an AI tutor, I recommend checking the corresponding module documentation or re-playing the associated game to reinforce your understanding.";
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    res.json({
        reply: aiResponse,
        timestamp: new Date()
    });
}));

module.exports = router;
