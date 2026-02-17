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

    // Validation
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please provide name, email, and password');
    }

    if (password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters long');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists with this email');
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'student',
        authProvider: 'local'
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            authProvider: user.authProvider,
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

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    // Check if user registered via OAuth
    if (user.authProvider !== 'local') {
        res.status(401);
        throw new Error(`This account uses ${user.authProvider} login. Please use the "${user.authProvider}" button to sign in.`);
    }

    // Verify password
    if (await user.matchPassword(password)) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            authProvider: user.authProvider,
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

// Helper function to check if OAuth is configured
const isOAuthConfigured = (provider) => {
    const configs = {
        google: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
        github: process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
        linkedin: process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
    };
    
    const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`];
    const isPlaceholder = !clientId || 
                         clientId.includes('your_') || 
                         clientId.includes('_here') ||
                         clientId === 'DISABLED' ||
                         clientId === 'placeholder';
    
    return configs[provider] && !isPlaceholder;
};

// @desc    Get OAuth configuration status
// @route   GET /api/auth/oauth-status
// @access  Public
router.get('/oauth-status', (req, res) => {
    res.json({
        google: isOAuthConfigured('google'),
        github: isOAuthConfigured('github'),
        linkedin: isOAuthConfigured('linkedin')
    });
});

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

router.get('/google', (req, res, next) => {
    if (!isOAuthConfigured('google')) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_not_configured&provider=Google`);
    }
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
    (req, res) => {
        try {
            const token = generateToken(req.user._id);
            res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
        } catch (error) {
            console.error('Google OAuth callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
        }
    }
);

// ============================================
// GITHUB OAUTH
// ============================================

router.get('/github', (req, res, next) => {
    if (!isOAuthConfigured('github')) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_not_configured&provider=GitHub`);
    }
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

router.get('/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
    (req, res) => {
        try {
            const token = generateToken(req.user._id);
            res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
        } catch (error) {
            console.error('GitHub OAuth callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
        }
    }
);

// ============================================
// LINKEDIN OAUTH
// ============================================

router.get('/linkedin', (req, res, next) => {
    if (!isOAuthConfigured('linkedin')) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_not_configured&provider=LinkedIn`);
    }
    passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] })(req, res, next);
});

router.get('/linkedin/callback',
    passport.authenticate('linkedin', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
    (req, res) => {
        try {
            const token = generateToken(req.user._id);
            res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
        } catch (error) {
            console.error('LinkedIn OAuth callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
        }
    }
);

// ============================================
// LEETCODE OAUTH (NOT AVAILABLE)
// ============================================
// LeetCode does not provide public OAuth API
// Redirect users to login page with informative message

router.get('/leetcode', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=leetcode_unavailable`);
});

router.get('/leetcode/callback', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=leetcode_unavailable`);
});

module.exports = router;
