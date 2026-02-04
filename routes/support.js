const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Mock transporter for dev
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
    }
});

// @desc    Send support email
// @route   POST /api/support/email
// @access  Public
router.post('/email', async (req, res) => {
    try {
        const { email, subject, message } = req.body;

        if (!email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // In a real app, use environment variables for email creds
        console.log('--- MOCK EMAIL HANDLING ---');
        console.log(`From: ${email}`);
        console.log(`Subject: ${subject}`);
        console.log(`Message: ${message}`);
        console.log('---------------------------');

        // Simulate potential network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        res.json({ message: 'Support ticket created! We will contact you shortly.' });

    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

module.exports = router;
