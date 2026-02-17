# 🔐 Setup OAuth - Step by Step (15 Minutes)

## Overview

You need to create OAuth applications on:
1. **Google** (5 minutes)
2. **GitHub** (3 minutes)
3. **LinkedIn** (7 minutes)

Then paste the credentials into your `.env` file.

---

## 1️⃣ GOOGLE OAUTH (5 Minutes)

### Step 1: Go to Google Cloud Console
🔗 Open: https://console.cloud.google.com/

### Step 2: Create a New Project
1. Click the project dropdown at the top
2. Click "NEW PROJECT"
3. Project name: `LevelUpED`
4. Click "CREATE"
5. Wait 30 seconds for it to be created
6. Select the new project from the dropdown

### Step 3: Configure OAuth Consent Screen
1. In the left menu: **APIs & Services** → **OAuth consent screen**
2. Select **External**
3. Click "CREATE"
4. Fill in:
   - App name: `LevelUpED`
   - User support email: `your-email@gmail.com`
   - Developer contact: `your-email@gmail.com`
5. Click "SAVE AND CONTINUE"
6. Scopes: Click "SAVE AND CONTINUE" (skip this)
7. Test users: Click "ADD USERS"
   - Add your email address
   - Click "ADD"
8. Click "SAVE AND CONTINUE"
9. Click "BACK TO DASHBOARD"

### Step 4: Create OAuth Credentials
1. In the left menu: **APIs & Services** → **Credentials**
2. Click "CREATE CREDENTIALS" → "OAuth client ID"
3. Application type: **Web application**
4. Name: `LevelUpED Web Client`
5. **Authorized JavaScript origins:**
   - Click "ADD URI"
   - Enter: `http://localhost:3001`
6. **Authorized redirect URIs:**
   - Click "ADD URI"
   - Enter: `http://localhost:5000/api/auth/google/callback`
7. Click "CREATE"

### Step 5: Copy Your Credentials
You'll see a popup with:
- **Client ID** (looks like: `123456789-abc123xyz.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-abc123xyz`)

**COPY BOTH!** You'll need them in Step 4.

---

## 2️⃣ GITHUB OAUTH (3 Minutes)

### Step 1: Go to GitHub Developer Settings
🔗 Open: https://github.com/settings/developers

### Step 2: Create New OAuth App
1. Click "OAuth Apps" in the left sidebar
2. Click "New OAuth App"
3. Fill in:
   - **Application name:** `LevelUpED`
   - **Homepage URL:** `http://localhost:3001`
   - **Authorization callback URL:** `http://localhost:5000/api/auth/github/callback`
4. Click "Register application"

### Step 3: Copy Your Credentials
1. You'll see your **Client ID** - COPY IT
2. Click "Generate a new client secret"
3. **COPY the Client Secret** (you can only see it once!)

---

## 3️⃣ LINKEDIN OAUTH (7 Minutes)

### Step 1: Create a LinkedIn Page (if you don't have one)
🔗 Go to: https://www.linkedin.com/company/setup/new/
1. Create a simple company page (required for OAuth)
2. Fill in basic info:
   - Company name: `LevelUpED`
   - LinkedIn public URL: `leveluped`
   - Website: `http://localhost:3001`
   - Industry: Education
   - Company size: 1-10 employees
3. Click "Create page"

### Step 2: Create LinkedIn App
🔗 Go to: https://www.linkedin.com/developers/apps
1. Click "Create app"
2. Fill in:
   - **App name:** `LevelUpED`
   - **LinkedIn Page:** Select the page you just created
   - **App logo:** Upload any image (optional but recommended)
3. Check "I have read and agree to these terms"
4. Click "Create app"

### Step 3: Configure OAuth Settings
1. Go to the "Auth" tab
2. Under "OAuth 2.0 settings":
   - Click "Add redirect URL"
   - Enter: `http://localhost:5000/api/auth/linkedin/callback`
   - Click "Update"
3. Under "OAuth 2.0 scopes":
   - Find `r_liteprofile` - Click "Request access"
   - Find `r_emailaddress` - Click "Request access"
   - Wait for approval (usually instant)

### Step 4: Copy Your Credentials
1. Go to "Settings" tab
2. **COPY the Client ID**
3. **COPY the Client Secret**

---

## 4️⃣ UPDATE YOUR .ENV FILE

Open your `.env` file and replace these lines:

```env
GOOGLE_CLIENT_ID=paste_your_google_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_google_client_secret_here

GITHUB_CLIENT_ID=paste_your_github_client_id_here
GITHUB_CLIENT_SECRET=paste_your_github_client_secret_here

LINKEDIN_CLIENT_ID=paste_your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=paste_your_linkedin_client_secret_here
```

### Example (with fake credentials):
```env
GOOGLE_CLIENT_ID=123456789-abc123xyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz456def

GITHUB_CLIENT_ID=Iv1.abc123xyz456
GITHUB_CLIENT_SECRET=abc123xyz456def789ghi012jkl345mno678pqr

LINKEDIN_CLIENT_ID=abc123xyz456
LINKEDIN_CLIENT_SECRET=AbCdEfGhIjKl
```

---

## 5️⃣ TEST OAUTH

### Step 1: Save .env and Restart
1. Save the `.env` file
2. The server will auto-restart (nodemon)
3. Wait 5 seconds

### Step 2: Check OAuth Status
Open terminal and run:
```powershell
curl http://localhost:5000/api/auth/oauth-status
```

Should return:
```json
{"google":true,"github":true,"linkedin":true}
```

### Step 3: Test in Browser
1. Go to: http://localhost:3001/login
2. You should now see OAuth buttons:
   - 🔵 Continue with Google
   - ⚫ Continue with GitHub
   - 🔷 Continue with LinkedIn
3. Click any button
4. Sign in with that provider
5. You'll be redirected back and logged in!

---

## 🎉 DONE!

Once you update `.env` with your credentials:
- ✅ OAuth buttons will appear automatically
- ✅ Users can login with Google/GitHub/LinkedIn
- ✅ Everything works smoothly

---

## 📝 Quick Checklist

- [ ] Created Google OAuth app
- [ ] Created GitHub OAuth app
- [ ] Created LinkedIn OAuth app (and LinkedIn page)
- [ ] Copied all 6 credentials (3 Client IDs + 3 Client Secrets)
- [ ] Updated `.env` file
- [ ] Saved `.env` file
- [ ] Server restarted automatically
- [ ] Tested OAuth status endpoint
- [ ] Saw OAuth buttons on login page
- [ ] Successfully logged in with OAuth

---

## 🆘 Troubleshooting

### "Redirect URI mismatch"
Make sure callback URLs are EXACTLY:
- Google: `http://localhost:5000/api/auth/google/callback`
- GitHub: `http://localhost:5000/api/auth/github/callback`
- LinkedIn: `http://localhost:5000/api/auth/linkedin/callback`

### "This app isn't verified" (Google)
- Click "Advanced"
- Click "Go to LevelUpED (unsafe)"
- This is normal for development apps

### OAuth buttons still not showing
- Hard refresh: Ctrl + Shift + R
- Check `.env` has real credentials (not placeholders)
- Check server logs for "OAuth Status: ✅ READY"

---

**Time to complete: ~15 minutes**
**Difficulty: Easy - just follow the steps!**
