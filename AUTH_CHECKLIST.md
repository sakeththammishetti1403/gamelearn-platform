# Authentication System Checklist

Use this checklist to verify that all authentication features are working correctly.

## ✅ Pre-Flight Checks

- [ ] Node.js v18+ installed
- [ ] MongoDB connection string configured in `.env`
- [ ] `npm install` completed successfully
- [ ] `cd client && npm install` completed successfully
- [ ] `.env` file exists with all required variables

## ✅ Local Authentication (Email/Password)

### Registration
- [ ] Navigate to http://localhost:5173/register
- [ ] Form displays correctly with all fields
- [ ] Can enter name, email, password, and select role
- [ ] Password validation works (minimum 6 characters)
- [ ] Email validation works (valid email format)
- [ ] Clicking "Register" creates a new account
- [ ] Automatically logged in after registration
- [ ] Redirected to appropriate dashboard based on role
- [ ] Error shown if email already exists
- [ ] Error shown if fields are missing

### Login
- [ ] Navigate to http://localhost:5173/login
- [ ] Form displays correctly
- [ ] Can enter email and password
- [ ] Clicking "Login" logs in successfully
- [ ] Redirected to appropriate dashboard based on role
- [ ] Error shown for invalid credentials
- [ ] Error shown for missing fields
- [ ] Error shown if OAuth user tries to login with password

### Token Management
- [ ] JWT token stored in localStorage after login
- [ ] User data stored in localStorage after login
- [ ] Token included in API requests (Authorization header)
- [ ] Token verified on protected routes
- [ ] Invalid token redirects to login
- [ ] Expired token redirects to login

### User Session
- [ ] User stays logged in after page refresh
- [ ] User data persists across page refreshes
- [ ] Logout clears token and user data
- [ ] Logout redirects to login page

## ✅ OAuth Authentication (If Configured)

### Google OAuth
- [ ] "Continue with Google" button displays
- [ ] Clicking button redirects to Google login
- [ ] Can sign in with Google account
- [ ] Can grant permissions
- [ ] Redirected back to app after authorization
- [ ] Automatically logged in
- [ ] User created in database with Google provider
- [ ] Avatar from Google profile saved
- [ ] Error handling works if OAuth fails

### GitHub OAuth
- [ ] "Continue with GitHub" button displays
- [ ] Clicking button redirects to GitHub authorization
- [ ] Can authorize the app
- [ ] Redirected back to app after authorization
- [ ] Automatically logged in
- [ ] User created in database with GitHub provider
- [ ] Avatar from GitHub profile saved
- [ ] Error handling works if OAuth fails

### LinkedIn OAuth
- [ ] "Continue with LinkedIn" button displays
- [ ] Clicking button redirects to LinkedIn login
- [ ] Can sign in and grant permissions
- [ ] Redirected back to app after authorization
- [ ] Automatically logged in
- [ ] User created in database with LinkedIn provider
- [ ] Avatar from LinkedIn profile saved
- [ ] Error handling works if OAuth fails

### OAuth Edge Cases
- [ ] Existing email with different provider handled correctly
- [ ] OAuth user can't login with password
- [ ] OAuth user profile updates on subsequent logins
- [ ] Missing email handled with placeholder

## ✅ API Endpoints

### POST /api/auth/register
- [ ] Returns 201 with user data and token on success
- [ ] Returns 400 if email already exists
- [ ] Returns 400 if required fields missing
- [ ] Returns 400 if password too short
- [ ] Password is hashed in database
- [ ] authProvider set to 'local'

### POST /api/auth/login
- [ ] Returns 200 with user data and token on success
- [ ] Returns 401 for invalid credentials
- [ ] Returns 400 if fields missing
- [ ] Returns 401 if OAuth user tries password login
- [ ] Includes avatar and authProvider in response

### GET /api/auth/me
- [ ] Returns 200 with user data when authenticated
- [ ] Returns 401 without valid token
- [ ] Returns 401 with invalid token
- [ ] Returns 401 with expired token

### OAuth Callback Routes
- [ ] /api/auth/google/callback works
- [ ] /api/auth/github/callback works
- [ ] /api/auth/linkedin/callback works
- [ ] All callbacks redirect to /auth/success with token
- [ ] Failed OAuth redirects to /login with error

## ✅ Security

### Password Security
- [ ] Passwords hashed with bcrypt
- [ ] Passwords never returned in API responses
- [ ] Password comparison uses bcrypt.compare
- [ ] OAuth users have no password field

### Token Security
- [ ] JWT tokens signed with secret
- [ ] Tokens expire after 30 days
- [ ] Tokens include only user ID
- [ ] Tokens verified on protected routes

### Input Validation
- [ ] Email format validated
- [ ] Password length validated
- [ ] Required fields validated
- [ ] SQL injection prevented (using Mongoose)
- [ ] XSS prevented (React escapes by default)

### Error Handling
- [ ] Generic error messages (no information leakage)
- [ ] Errors logged on server
- [ ] User-friendly error messages on client
- [ ] No stack traces exposed to client

## ✅ User Experience

### Error Messages
- [ ] Clear error messages for all scenarios
- [ ] Errors displayed prominently
- [ ] Errors cleared when form resubmitted
- [ ] OAuth errors shown from URL parameters

### Loading States
- [ ] Loading indicator during registration
- [ ] Loading indicator during login
- [ ] Loading indicator during OAuth callback
- [ ] Buttons disabled during loading

### Navigation
- [ ] Login page has link to register
- [ ] Register page has link to login
- [ ] Successful auth redirects to correct dashboard
- [ ] Failed auth stays on login/register page

### Responsive Design
- [ ] Forms work on mobile devices
- [ ] OAuth buttons work on mobile
- [ ] Error messages readable on mobile

## ✅ Database

### User Model
- [ ] Users created with correct schema
- [ ] Email is unique
- [ ] Password hashed before save
- [ ] authProvider field set correctly
- [ ] providerId set for OAuth users
- [ ] Avatar saved for OAuth users
- [ ] Default role is 'student'

### Data Integrity
- [ ] No duplicate emails
- [ ] OAuth users have providerId
- [ ] Local users have password
- [ ] All users have name and email

## ✅ Environment Configuration

### Required Variables
- [ ] MONGO_URI set and valid
- [ ] JWT_SECRET set
- [ ] SESSION_SECRET set
- [ ] FRONTEND_URL set correctly
- [ ] BACKEND_URL set correctly
- [ ] PORT set (default 5000)

### OAuth Variables (if using OAuth)
- [ ] GOOGLE_CLIENT_ID set
- [ ] GOOGLE_CLIENT_SECRET set
- [ ] GITHUB_CLIENT_ID set
- [ ] GITHUB_CLIENT_SECRET set
- [ ] LINKEDIN_CLIENT_ID set
- [ ] LINKEDIN_CLIENT_SECRET set

### Validation
- [ ] Server starts without errors
- [ ] Environment validation runs on startup
- [ ] Warnings shown for unconfigured OAuth
- [ ] Clear instructions provided in warnings

## ✅ Documentation

- [ ] README.md updated with auth info
- [ ] OAUTH_SETUP.md created with setup instructions
- [ ] AUTH_TESTING.md created with testing guide
- [ ] AUTH_FIXES_SUMMARY.md documents all fixes
- [ ] QUICK_START.md provides quick setup
- [ ] .env.example created as template

## 🎯 Final Verification

Run through this complete flow:

1. [ ] Start fresh (clear localStorage)
2. [ ] Register a new account with email/password
3. [ ] Verify logged in and redirected correctly
4. [ ] Logout
5. [ ] Login with same credentials
6. [ ] Verify logged in successfully
7. [ ] Refresh page
8. [ ] Verify still logged in
9. [ ] Try to access protected route
10. [ ] Verify access granted
11. [ ] Logout
12. [ ] Try to access protected route
13. [ ] Verify redirected to login

If OAuth is configured:
14. [ ] Click OAuth provider button
15. [ ] Complete OAuth flow
16. [ ] Verify logged in successfully
17. [ ] Logout
18. [ ] Login again with same OAuth provider
19. [ ] Verify logged in successfully

## 📊 Test Results

Date: _______________
Tester: _______________

### Summary
- Total Checks: _____ / _____
- Passed: _____
- Failed: _____
- Skipped (OAuth not configured): _____

### Issues Found
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Notes
_____________________________________________________
_____________________________________________________
_____________________________________________________

## ✅ Sign-Off

- [ ] All critical checks passed
- [ ] Documentation is complete
- [ ] Ready for production deployment

Signed: _______________ Date: _______________
