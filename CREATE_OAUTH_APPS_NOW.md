# Create OAuth Apps - Do This Now (15 Minutes)

Registration is now working! To enable social login, follow these exact steps:

## 1. Google OAuth (5 minutes)

### Step 1: Go to Google Cloud Console
Open: https://console.cloud.google.com/

### Step 2: Create Project
1. Click "Select a project" dropdown at the top
2. Click "NEW PROJECT"
3. Project name: `LevelUpED`
4. Click "CREATE"
5. Wait for project to be created (30 seconds)

### Step 3: Configure OAuth Consent Screen
1. In left menu: APIs & Services → OAuth consent screen
2. User Type: Select "External"
3. Click "CREATE"
4. Fill in:
   - App name: `LevelUpED`
   - User support email: `your-email@gmail.com`
   - Developer contact: `your-email@gmail.com`
5. Click "SAVE AND CONTINUE"
6. Scopes: Click "SAVE AND CONTINUE" (skip)
7. Test users: Click "ADD USERS", add your email
8. Click "SAVE AND CONTINUE"
9. Click "BACK TO DASHBOARD"

### Step 4: Create Credentials
1. In left menu: APIs & Services → Credentials
2. Click "CREATE CREDENTIALS" → "OAuth client ID"
3. Application type: "Web application"
4. Name: `LevelUpED Web`
5. Authorized JavaScript origins:
   - Click "ADD URI"
   - Enter: `http://localhost:3001`
6. Authorized redirect URIs:
   - Click "ADD URI"
   - Enter: `http://localhost:5000/api/auth/google/callback`
7. Click "CREATE"
8. **COPY the Client ID** (looks like: 123456-abc.apps.googleusercontent.com)
9. **COPY the Client Secret** (looks like: GOCSPX-abc123)

### Step 5: Update .env
Open `.env` file and replace:
```env
GOOGLE_CLIENT_ID=paste_your_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
```

## 2. GitHub OAuth (3 minutes)

### Step 1: Go to GitHub Settings
Open: https://github.com/settings/developers

### Step 2: Create OAuth App
1. Click "OAuth Apps" in left sidebar
2. Click "New OAuth App"
3. Fill in:
   - Application name: `LevelUpED`
   - Homepage URL: `http://localhost:3001`
   - Authorization callback URL: `http://localhost:5000/api/auth/github/callback`
4. Click "Register application"

### Step 3: Get Credentials
1. You'll see your **Client ID** - COPY IT
2. Click "Generate a new client secret"
3. **COPY the Client Secret** (you can only see it once!)

### Step 4: Update .env
Open `.env` file and replace:
```env
GITHUB_CLIENT_ID=paste_your_client_id_here
GITHUB_CLIENT_SECRET=paste_your_client_secret_here
```

## 3. LinkedIn OAuth (7 minutes)

### Step 1: Create LinkedIn Page (if you don't have one)
1. Go to: https://www.linkedin.com/company/setup/new/
2. Create a simple company page (required for OAuth app)
3. Fill in basic info and create

### Step 2: Create LinkedIn App
1. Go to: https://www.linkedin.com/developers/apps
2. Click "Create app"
3. Fill in:
   - App name: `LevelUpED`
   - LinkedIn Page: Select the page you just created
   - App logo: Upload any image (optional)
4. Check "I have read and agree to these terms"
5. Click "Create app"

### Step 3: Configure OAuth
1. Go to "Auth" tab
2. Under "OAuth 2.0 settings":
   - Click "Add redirect URL"
   - Enter: `http://localhost:5000/api/auth/linkedin/callback`
   - Click "Update"
3. Under "OAuth 2.0 scopes":
   - Find "r_liteprofile" - click "Request access"
   - Find "r_emailaddress" - click "Request access"

### Step 4: Get Credentials
1. Go to "Settings" tab
2. **COPY the Client ID**
3. **COPY the Client Secret**

### Step 5: Update .env
Open `.env` file and replace:
```env
LINKEDIN_CLIENT_ID=paste_your_client_id_here
LINKEDIN_CLIENT_SECRET=paste_your_client_secret_here
```

## 4. Final .env File

Your `.env` should look like this (with your actual credentials):

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
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_actual_secret

GITHUB_CLIENT_ID=Iv1.your_actual_client_id
GITHUB_CLIENT_SECRET=your_actual_secret_here

LINKEDIN_CLIENT_ID=your_actual_client_id
LINKEDIN_CLIENT_SECRET=your_actual_secret
```

## 5. Test OAuth

1. Save the `.env` file
2. Server will auto-restart
3. Go to: http://localhost:3001/login
4. You should now see OAuth buttons!
5. Click any button to test
6. Sign in and authorize
7. You'll be logged in!

## Quick Verification

After updating `.env`, check if OAuth is configured:
```bash
curl http://localhost:5000/api/auth/oauth-status
```

Should return:
```json
{"google":true,"github":true,"linkedin":true}
```

## Troubleshooting

### "Redirect URI mismatch"
- Make sure callback URLs are EXACTLY:
  - Google: `http://localhost:5000/api/auth/google/callback`
  - GitHub: `http://localhost:5000/api/auth/github/callback`
  - LinkedIn: `http://localhost:5000/api/auth/linkedin/callback`

### "This app isn't verified" (Google)
- Click "Advanced"
- Click "Go to LevelUpED (unsafe)"
- This is normal for development

### OAuth buttons still not showing
- Hard refresh: Ctrl+Shift+R
- Check `.env` has real credentials (not placeholders)
- Check server logs for "OAuth Status: ✅ READY"

## Done!

Once you've updated `.env` with all three providers, OAuth will work automatically!
