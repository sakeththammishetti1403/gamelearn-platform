const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
    // Helper to generate a unique placeholder email
    const placeholderEmail = (provider, id) => `${provider}_${id}@gamelearn.internal`;

    // ============================================
    // GOOGLE STRATEGY
    // ============================================
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL || 'https://gamelearn-platform-1.onrender.com'}/api/auth/google/callback`
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({
                    $or: [
                        { providerId: profile.id, authProvider: 'google' },
                        { email: profile.emails?.[0]?.value }
                    ]
                });

                if (user) {
                    if (user.authProvider !== 'google') {
                        user.authProvider = 'google';
                        user.providerId = profile.id;
                    }
                    user.avatar = profile.photos?.[0]?.value || user.avatar;
                    await user.save();
                    return done(null, user);
                }

                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value || placeholderEmail('google', profile.id),
                    authProvider: 'google',
                    providerId: profile.id,
                    avatar: profile.photos?.[0]?.value || '',
                    role: 'student'
                });

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }));

    // ============================================
    // GITHUB STRATEGY
    // ============================================
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL || 'https://gamelearn-platform-1.onrender.com'}/api/auth/github/callback`,
        scope: ['user:email']
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                let user = await User.findOne({
                    $or: [
                        { providerId: profile.id, authProvider: 'github' },
                        { email: email && email !== '' ? email : undefined }
                    ].filter(q => q.email !== undefined || q.providerId !== undefined)
                });

                if (user) {
                    if (user.authProvider !== 'github') {
                        user.authProvider = 'github';
                        user.providerId = profile.id;
                    }
                    user.avatar = profile.photos?.[0]?.value || user.avatar;
                    await user.save();
                    return done(null, user);
                }

                user = await User.create({
                    name: profile.displayName || profile.username,
                    email: email || placeholderEmail('github', profile.id),
                    authProvider: 'github',
                    providerId: profile.id,
                    avatar: profile.photos?.[0]?.value || '',
                    role: 'student'
                });

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }));

    // ============================================
    // LINKEDIN STRATEGY
    // ============================================
    passport.use(new LinkedInStrategy({
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL || 'https://gamelearn-platform-1.onrender.com'}/api/auth/linkedin/callback`,
        scope: ['r_emailaddress', 'r_liteprofile']
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({
                    $or: [
                        { providerId: profile.id, authProvider: 'linkedin' },
                        { email: profile.emails?.[0]?.value }
                    ]
                });

                if (user) {
                    if (user.authProvider !== 'linkedin') {
                        user.authProvider = 'linkedin';
                        user.providerId = profile.id;
                    }
                    user.avatar = profile.photos?.[0]?.value || user.avatar;
                    await user.save();
                    return done(null, user);
                }

                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value || placeholderEmail('linkedin', profile.id),
                    authProvider: 'linkedin',
                    providerId: profile.id,
                    avatar: profile.photos?.[0]?.value || '',
                    role: 'student'
                });

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }));

    // ============================================
    // LEETCODE STRATEGY (PLACEHOLDER)
    // ============================================
    // LeetCode does not have a public OAuth. 
    // This is kept for UI consistency but will redirect to login error if used without custom implementation.
    passport.use('leetcode', new GoogleStrategy({
        clientID: 'placeholder',
        clientSecret: 'placeholder',
        callbackURL: '/api/auth/leetcode/callback'
    }, (accessToken, refreshToken, profile, done) => {
        done(new Error('LeetCode registration is currently invitation-only or requires manual account link.'), null);
    }));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};
