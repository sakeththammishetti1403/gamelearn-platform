# Setting Up OAuth Credentials - Step by Step

Since you want OAuth working, you need to create OAuth applications on Google, GitHub, and LinkedIn. I'll guide you through each one.

## Important URLs

Your application URLs for OAuth callbacks:
- **Frontend URL:** http://localhost:3001
- **Backend URL:** http://localhost:5000
- **Google Callback:** http://localhost:5000/api/auth/google/callback
- **GitHub Callback:** http://localhost:5000/api/auth/github/callback
- **LinkedIn Callback:** http://localhost:5000/api/auth/linkedin/callback

## 1. Google OAuth Setup (5 minutes)

### Step 1: Go to Google Cloud Console
1. Open: https://console.cloud.google.com/
2. Sign in with your Google account
3. Click "Select a project" → "New Project"
4. Name: "LevelUpED" or any name
5. Click "Create"

### Step 2: Enable Google+ API
1. In the left menu, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and click "Enable"

### Step 3: Create OAuth Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: LevelUpED
   - User support email: your email
   - Developer contact: your email
   - Click "Save and Continue"
   - Scopes: Skip this, click "Save and Continue"
   - Test users: Add your email, click "Save and Continue"
4. Now create OAuth client ID:
   - Application type: Web application
   - Name: LevelUpED Web Client
   - Authorized JavaScript origins:
     - http://localhost:3001
     - http://localhost:5173
   - Authorized redirect URIs:
     - http://localhost:5000/api/auth/google/callback
5. Click "Create"
6. **COPY** the Client ID and Client Secret

### Step 4: Update .env
```env
GOOGLE_CLIENT_ID=your_actual_client_id_from_google
GOOGLE_CLIENT_SECRET=your_actual_client_secret_from_google
```

## 2. GitHub OAuth Setup (3 minutes)

### Step 1: Go to GitHub Developer Settings
1. Open: https://github.com/settings/developers
2. Click "OAuth Apps" in the left sidebar
3. Click "New OAuth App"

### Step 2: Fill in the Details
- **Application name:** LevelUpED
- **Homepage URL:** http://localhost:3001
- **Application description:** Learning platform with gamification
- **Authorization callback URL:** http://localhost:5000/api/auth/github/callback
- Click "Register application"

### Step 3: Get Credentials
1. You'll see your Client ID
2. Click "Generate a new client secret"
3. **COPY** both the Client ID and Client Secret

### Step 4: Update .env
```env
GITHUB_CLIENT_ID=your_actual_client_id_from_github
GITHUB_CLIENT_SECRET=your_actual_client_secret_from_github
```

## 3. LinkedIn OAuth Setup (5 minutes)

### Step 1: Go to LinkedIn Developers
1. Open: https://www.linkedin.com/developers/apps
2. Sign in with your LinkedIn account
3. Click "Create app"

### Step 2: Fill in the Details
- **App name:** LevelUpED
- **LinkedIn Page:** (You need to create a LinkedIn page first, or use an existing one)
  - If you don't have one, create a simple company page first
- **App logo:** Upload any logo (optional but recommended)
- **Legal agreement:** Check the box
- Click "Create app"

### Step 3: Configure OAuth Settings
1. Go to the "Auth" tab
2. Under "OAuth 2.0 settings":
   - **Redirect URLs:** Add http://localhost:5000/api/auth/linkedin/callback
3. Under "OAuth 2.0 scopes":
   - Request access to: r_liteprofile, r_emailaddress
   - Click "Request access" if needed
4. Go to the "Settings" tab
5. **COPY** the Client ID and Client Secret

### Step 4: Update .env
```env
LINKEDIN_CLIENT_ID=your_actual_client_id_from_linkedin
LINKEDIN_CLIENT_SECRET=your_actual_client_secret_from_linkedin
```

## 4. Final .env File

Your complete `.env` should look like this:

```env
# ================================
# SERVER
# ================================
PORT=5000
NODE_ENV=development
BACKEND_URL=http://localhost:5000/api

# ================================
# DATABASE
# ================================
MONGO_URI=mongodb+srv://admin:Sakethbalu@m0.8vwfsmh.mongodb.net/?appName=M0

# ================================
# AUTH
# ================================
JWT_SECRET=gamelearn_local_jwt_secret_change_this
SESSION_SECRET=gamelearn_session_secret_change_this_in_production

# ================================
# FRONTEND
# ================================
FRONTEND_URL=http://localhost:3001

# ================================
# OAUTH CREDENTIALS
# ================================
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz

GITHUB_CLIENT_ID=Iv1.abcdefghijklmnop
GITHUB_CLIENT_SECRET=abcdefghijklmnopqrstuvwxyz1234567890abcd

LINKEDIN_CLIENT_ID=abcdefghij1234
LINKEDIN_CLIENT_SECRET=AbCdEfGhIjKlMnOp
```

## 5. Restart the Server

After updating `.env`:
1. The server should auto-restart (nodemon)
2. Or manually restart it
3. You should see: "OAuth Status: ✅ READY"

## 6. Test OAuth

1. Go to http://localhost:3001/login
2. You should now see OAuth buttons for Google, GitHub, and LinkedIn
3. Click any button to test
4. You'll be redirected to the provider
5. Sign in and authorize
6. You'll be redirected back and logged in!

## Troubleshooting

### "Redirect URI mismatch"
- Make sure the callback URL in your OAuth app settings exactly matches:
  - Google: http://localhost:5000/api/auth/google/callback
  - GitHub: http://localhost:5000/api/auth/github/callback
  - LinkedIn: http://localhost:5000/api/auth/linkedin/callback

### "This app isn't verified" (Google)
- Click "Advanced" → "Go to LevelUpED (unsafe)"
- This is normal for development apps

### "Authorization callback URL not approved" (LinkedIn)
- Make sure you added the redirect URL in the Auth tab
- Wait a few minutes for LinkedIn to process the change

### OAuth buttons still not showing
- Hard refresh the page (Ctrl+Shift+R)
- Check browser console for errors
- Verify .env has real credentials (not placeholders)

## Quick Test

After setup, test the OAuth status endpoint:
```bash
curl http://localhost:5000/api/auth/oauth-status
```

Should return:
```json
{"google":true,"github":true,"linkedin":true}
```

If any are `false`, that provider isn't configured correctly.
