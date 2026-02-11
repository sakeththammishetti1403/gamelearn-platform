const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const { protect } = require('../middleware/authMiddleware');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', catchAsync(async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'student',
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
}));

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
}));

// ============================================
// OAUTH ROUTES
// ============================================

const passport = require('passport');
require('../config/passport')(passport);

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, catchAsync(async (req, res) => {
    // req.user is already populated by protect middleware
    res.json(req.user);
}));

// ============================================
// GOOGLE OAUTH
// ============================================

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
    (req, res) => {
        const token = generateToken(req.user._id);
        res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    }
);

// ============================================
// GITHUB OAUTH
// ============================================

router.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
    (req, res) => {
        const token = generateToken(req.user._id);
        res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    }
);

// ============================================
// LINKEDIN OAUTH
// ============================================

router.get('/linkedin',
    passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] })
);

router.get('/linkedin/callback',
    passport.authenticate('linkedin', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
    (req, res) => {
        const token = generateToken(req.user._id);
        res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    }
);

// ============================================
// LEETCODE OAUTH (STUB)
// ============================================

router.get('/leetcode',
    passport.authenticate('leetcode', { scope: ['profile', 'email'] })
);

router.get('/leetcode/callback',
    passport.authenticate('leetcode', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
    (req, res) => {
        const token = generateToken(req.user._id);
        res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    }
);

module.exports = router;
