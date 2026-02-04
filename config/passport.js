const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
    // ============================================
    // GOOGLE STRATEGY
    // ============================================
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback'
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log('🔐 [OAUTH] Google login attempt:', profile.displayName);

                // Check if user exists
                let user = await User.findOne({ providerId: profile.id, authProvider: 'google' });

                if (user) {
                    console.log('✅ [OAUTH] Existing Google user found');
                    return done(null, user);
                }

                // Check if email already exists with different provider
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
                if (email) {
                    user = await User.findOne({ email });
                    if (user) {
                        // Link Google to existing account
                        user.authProvider = 'google';
                        user.providerId = profile.id;
                        user.avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : '';
                        await user.save();
                        console.log('🔗 [OAUTH] Linked Google to existing account');
                        return done(null, user);
                    }
                }

                // Create new user
                user = await User.create({
                    name: profile.displayName,
                    email: email || `google_${profile.id}@placeholder.com`,
                    authProvider: 'google',
                    providerId: profile.id,
                    avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
                    role: 'student'
                });

                console.log('✅ [OAUTH] New Google user created');
                done(null, user);
            } catch (error) {
                console.error('❌ [OAUTH] Google auth error:', error);
                done(error, null);
            }
        }));

    // ============================================
    // GITHUB STRATEGY
    // ============================================
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/api/auth/github/callback',
        scope: ['user:email']
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log('🔐 [OAUTH] GitHub login attempt:', profile.username);

                // Check if user exists
                let user = await User.findOne({ providerId: profile.id, authProvider: 'github' });

                if (user) {
                    console.log('✅ [OAUTH] Existing GitHub user found');
                    return done(null, user);
                }

                // Get email (GitHub may not provide it)
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

                if (email) {
                    user = await User.findOne({ email });
                    if (user) {
                        // Link GitHub to existing account
                        user.authProvider = 'github';
                        user.providerId = profile.id;
                        user.avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : '';
                        await user.save();
                        console.log('🔗 [OAUTH] Linked GitHub to existing account');
                        return done(null, user);
                    }
                }

                // Create new user
                user = await User.create({
                    name: profile.displayName || profile.username,
                    email: email || `github_${profile.id}@placeholder.com`,
                    authProvider: 'github',
                    providerId: profile.id,
                    avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
                    role: 'student'
                });

                console.log('✅ [OAUTH] New GitHub user created');
                done(null, user);
            } catch (error) {
                console.error('❌ [OAUTH] GitHub auth error:', error);
                done(error, null);
            }
        }));

    // ============================================
    // LINKEDIN STRATEGY
    // ============================================
    passport.use(new LinkedInStrategy({
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: '/api/auth/linkedin/callback',
        scope: ['r_emailaddress', 'r_liteprofile']
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log('🔐 [OAUTH] LinkedIn login attempt:', profile.displayName);

                // Check if user exists
                let user = await User.findOne({ providerId: profile.id, authProvider: 'linkedin' });

                if (user) {
                    console.log('✅ [OAUTH] Existing LinkedIn user found');
                    return done(null, user);
                }

                // Get email
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

                if (email) {
                    user = await User.findOne({ email });
                    if (user) {
                        // Link LinkedIn to existing account
                        user.authProvider = 'linkedin';
                        user.providerId = profile.id;
                        user.avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : '';
                        await user.save();
                        console.log('🔗 [OAUTH] Linked LinkedIn to existing account');
                        return done(null, user);
                    }
                }

                // Create new user
                user = await User.create({
                    name: profile.displayName,
                    email: email || `linkedin_${profile.id}@placeholder.com`,
                    authProvider: 'linkedin',
                    providerId: profile.id,
                    avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
                    role: 'student'
                });

                console.log('✅ [OAUTH] New LinkedIn user created');
                done(null, user);
            } catch (error) {
                console.error('❌ [OAUTH] LinkedIn auth error:', error);
                done(error, null);
            }
        }));

    // Serialize user for session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user from session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};
