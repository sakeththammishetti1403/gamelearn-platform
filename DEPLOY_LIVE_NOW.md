# 🚀 Deploy Your Application Live

## Overview

We'll deploy:
- **Frontend** → Vercel (Free, Fast, Easy)
- **Backend** → Render (Free, Reliable)
- **Database** → MongoDB Atlas (Already set up)

**Total Time:** ~20 minutes

---

## PART 1: Deploy Backend to Render (10 minutes)

### Step 1: Create Render Account
1. Go to: https://render.com/
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended)

### Step 2: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
   - If not connected, click "Connect GitHub"
   - Authorize Render
   - Select your repository

### Step 3: Configure Web Service
Fill in these settings:

**Basic Settings:**
- **Name:** `leveluped-backend` (or any name)
- **Region:** Choose closest to you
- **Branch:** `main` (or your default branch)
- **Root Directory:** Leave empty
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Instance Type:**
- Select: **Free** (0$/month)

### Step 4: Add Environment Variables
Click "Advanced" → "Add Environment Variable"

Add these one by one:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://admin:Sakethbalu@m0.8vwfsmh.mongodb.net/?appName=M0
JWT_SECRET=your_strong_random_secret_here_change_this
SESSION_SECRET=your_strong_random_secret_here_change_this
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://leveluped-backend.onrender.com/api
```

**For OAuth (if configured):**
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. You'll get a URL like: `https://leveluped-backend.onrender.com`
4. **COPY THIS URL** - you'll need it for frontend

### Step 6: Test Backend
Once deployed, test:
```
https://your-backend-url.onrender.com/health
```

Should return: `{"status":"active",...}`

---

## PART 2: Deploy Frontend to Vercel (10 minutes)

### Step 1: Create Vercel Account
1. Go to: https://vercel.com/
2. Click "Sign Up"
3. Sign up with GitHub (recommended)

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Select the repository

### Step 3: Configure Project
**Framework Preset:** Vite
**Root Directory:** `client`
**Build Command:** `npm run build`
**Output Directory:** `dist`

### Step 4: Add Environment Variables
Click "Environment Variables"

Add this:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Replace `your-backend-url` with your actual Render URL from Part 1.

### Step 5: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll get a URL like: `https://your-app.vercel.app`

### Step 6: Update Backend Environment
Go back to Render dashboard:
1. Go to your backend service
2. Click "Environment"
3. Update `FRONTEND_URL` to your Vercel URL
4. Click "Save Changes"
5. Service will auto-redeploy

---

## PART 3: Update OAuth Callback URLs (If Using OAuth)

### Google OAuth
1. Go to: https://console.cloud.google.com/
2. APIs & Services → Credentials
3. Edit your OAuth client
4. Add to **Authorized JavaScript origins:**
   - `https://your-app.vercel.app`
5. Add to **Authorized redirect URIs:**
   - `https://your-backend-url.onrender.com/api/auth/google/callback`
6. Save

### GitHub OAuth
1. Go to: https://github.com/settings/developers
2. Edit your OAuth app
3. Update **Homepage URL:** `https://your-app.vercel.app`
4. Update **Authorization callback URL:**
   - `https://your-backend-url.onrender.com/api/auth/github/callback`
5. Save

### LinkedIn OAuth
1. Go to: https://www.linkedin.com/developers/apps
2. Edit your app
3. Go to "Auth" tab
4. Add redirect URL:
   - `https://your-backend-url.onrender.com/api/auth/linkedin/callback`
5. Save

---

## PART 4: Test Your Live Application

### Test 1: Access Frontend
Go to: `https://your-app.vercel.app`

Should see your login/register page.

### Test 2: Register a User
1. Click Register
2. Fill in the form
3. Submit
4. Should work!

### Test 3: Login
1. Go to login page
2. Enter credentials
3. Should work!

### Test 4: OAuth (if configured)
1. Click OAuth button
2. Sign in with provider
3. Should redirect back and login

---

## PART 5: Custom Domain (Optional)

### Vercel Custom Domain
1. Go to Vercel dashboard
2. Select your project
3. Settings → Domains
4. Add your domain
5. Follow DNS instructions

### Render Custom Domain
1. Go to Render dashboard
2. Select your service
3. Settings → Custom Domain
4. Add your domain
5. Follow DNS instructions

---

## Troubleshooting

### Backend Issues

**"Application failed to respond"**
- Check Render logs
- Verify environment variables
- Check MongoDB connection

**"CORS Error"**
- Update CORS in server.js to include production URLs
- Redeploy

### Frontend Issues

**"Network Error"**
- Check VITE_API_URL is correct
- Verify backend is running
- Check browser console

**"OAuth not working"**
- Update OAuth callback URLs
- Check OAuth credentials in Render
- Verify FRONTEND_URL and BACKEND_URL

### Database Issues

**"Cannot connect to MongoDB"**
- Check MONGO_URI is correct
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check MongoDB Atlas is not paused

---

## Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited deployments
- Always fast (no spin-down)

**MongoDB Atlas Free Tier:**
- 512MB storage
- Shared cluster
- Good for development/small apps

### Security Checklist

- [ ] Changed JWT_SECRET to strong random value
- [ ] Changed SESSION_SECRET to strong random value
- [ ] Updated OAuth callback URLs
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Environment variables set correctly
- [ ] MongoDB allows connections from anywhere

---

## Quick Reference

### Your URLs (Update these)
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.onrender.com
- **Backend API:** https://your-backend.onrender.com/api

### Important Files
- Backend env vars: Render Dashboard → Environment
- Frontend env vars: Vercel Dashboard → Settings → Environment Variables
- OAuth settings: Google/GitHub/LinkedIn developer consoles

---

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Share your live URL
3. ✅ Monitor Render logs
4. ✅ Set up custom domain (optional)
5. ✅ Enable OAuth (if not already)
6. ✅ Add more features

---

**Estimated Total Time:** 20 minutes
**Cost:** $0 (Free tier)
**Difficulty:** Easy - just follow the steps!

Your app will be live at:
- Frontend: https://your-app.vercel.app
- Backend: https://your-backend.onrender.com
