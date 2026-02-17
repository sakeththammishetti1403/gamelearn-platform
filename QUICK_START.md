# Quick Start Guide

Get LevelUpED running in 5 minutes!

## Step 1: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

## Step 2: Configure Environment

The `.env` file is already configured for local development with email/password authentication.

**Current Configuration:**
- ✅ MongoDB connection (already set)
- ✅ JWT Secret (set)
- ✅ Frontend URL (http://localhost:5173)
- ✅ Backend URL (http://localhost:5000/api)
- ⚠️ OAuth (needs configuration - optional)

**To enable OAuth (optional):**
See [OAUTH_SETUP.md](OAUTH_SETUP.md) for detailed instructions.

## Step 3: Start the Application

```bash
# Start both backend and frontend
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend on http://localhost:5173

## Step 4: Create Your First Account

1. Open http://localhost:5173/login in your browser
2. Click "Register" 
3. Fill in:
   - Name: Your Name
   - Email: your@email.com
   - Password: (minimum 6 characters)
   - Role: Student (or Instructor/Admin)
4. Click "Register"
5. You'll be automatically logged in!

## Step 5: Explore the Platform

Based on your role:

### Student Dashboard
- View learning paths and courses
- Complete modules and sections
- Play interactive games
- Track your progress
- Compete on leaderboards
- Join multiplayer arena

### Instructor Dashboard
- Create subjects and modules
- Add learning content
- Manage sections
- View student progress

### Admin Dashboard
- Manage users
- View platform statistics
- Control content visibility

## Common Commands

```bash
# Start development (both frontend and backend)
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Build for production
npm run build

# Seed database with sample data
npm run seed
```

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use:
1. Stop the conflicting process
2. Or change the PORT in `.env`

### MongoDB Connection Error
1. Check your `MONGO_URI` in `.env`
2. Ensure MongoDB is running (if using local)
3. Verify network access (if using MongoDB Atlas)

### OAuth Not Working
OAuth requires additional setup. See [OAUTH_SETUP.md](OAUTH_SETUP.md).
For now, use email/password authentication which works out of the box.

### Can't Login
1. Make sure you registered first
2. Check email and password are correct
3. If you registered via OAuth, use the OAuth button to login
4. Check server logs for detailed error messages

## Testing Authentication

Want to test the authentication system? See [AUTH_TESTING.md](AUTH_TESTING.md) for:
- API endpoint testing
- cURL examples
- Common error scenarios
- Automated testing scripts

## Next Steps

1. **Explore the Platform**: Try different features based on your role
2. **Add Content**: If you're an instructor, create some subjects and modules
3. **Enable OAuth**: Follow [OAUTH_SETUP.md](OAUTH_SETUP.md) to add social login
4. **Deploy**: See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## Need Help?

- **Authentication Issues**: See [AUTH_FIXES_SUMMARY.md](AUTH_FIXES_SUMMARY.md)
- **OAuth Setup**: See [OAUTH_SETUP.md](OAUTH_SETUP.md)
- **Testing**: See [AUTH_TESTING.md](AUTH_TESTING.md)
- **General Setup**: See [README.md](README.md)

## Quick Test

Test if everything is working:

```bash
# Test backend health
curl http://localhost:5000/health

# Expected response:
# {"status":"active","services":["api","sockets"],"timestamp":"..."}
```

## Summary

You're all set! 🎉

- ✅ Dependencies installed
- ✅ Environment configured
- ✅ Server running
- ✅ Ready to register and login

Start learning with LevelUpED!
