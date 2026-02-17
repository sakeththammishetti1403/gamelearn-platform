# Deployment Guide for LevelUpED (Monolithic)

This repository is configured for a single-server deployment where Node.js serves the React frontend.

## 1. Prerequisites
- **Node.js**: v18+
- **MongoDB**: Atlas Connection URI
- **Redis**: Connection URL (Optional)

## 2. Changes Made for Deployment
- **Build Script**: Added `"build"` to `package.json` to compile the frontend.
- **Server**: Updated `server.js` to serve `client/dist` and handle SPA routing (`*`).
- **Frontend API**: `client/src/services/api.js` now uses relative `/api` paths in production.
- **Frontend Socket**: `client/src/config/socketConfig.js` now uses the current window origin.

## 3. Environment Variables (Required)
Configure these on your hosting platform (Render, Heroku, Railway, etc.):

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_secure_jwt_secret

# OAuth Credentials (If using social login)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...

# Backend URL (For OAuth Callbacks)
# Set this to your deployed domain
BACKEND_URL=https://<your-app-name>.onrender.com

# Email (For Support)
EMAIL_USER=...
EMAIL_PASS=...

# Redis (Optional)
REDIS_URL=...
```

## 4. Deployment Steps

### Option A: Render.com (Recommended)
1.  Connect your GitHub repo.
2.  **Build Command**: `npm run build`
    - *This runs `npm install` (root) -> `cd client && npm install && npm run build`.*
3.  **Start Command**: `npm start`
    - *This runs `node server.js`.*
4.  Add Environment Variables from section 3.

### Option B: Heroku
1.  Add `heroku-postbuild` script in `package.json`:
    `"heroku-postbuild": "cd client && npm install && npm run build"`
    *(Note: The current `build` script handles this generally, but Heroku specifically looks for this or builds automatically if valid)*
2.  Deploy via CLI or Dashboard.

## 5. Verification Checklist
- [ ] **Home Page**: Loads the React app.
- [ ] **API Access**: `/api/health` returns status JSON.
- [ ] **Login/Register**: Forms submit correctly to `/api/auth/...`.
- [ ] **Real-time**: Chat/Socket connection status shows "Online".
- [ ] **Reloader**: Refreshing a sub-page (e.g., `/student/dashboard`) serves the app (doesn't 404).

## Final URL
Your application will be available at your platform's provided domain (e.g., `https://leveluped.onrender.com`).
