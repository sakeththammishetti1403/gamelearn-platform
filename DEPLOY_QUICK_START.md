# 🚀 Quick Deployment Guide

## 5-Minute Overview

### What We're Doing
1. Deploy backend to Render (free hosting)
2. Deploy frontend to Vercel (free hosting)
3. Connect them together
4. Your app is live!

---

## Step 1: Prepare Code (2 minutes)

### Check if ready:
```powershell
.\deploy-check.ps1
```

### If not ready:
```powershell
# Commit your code
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## Step 2: Deploy Backend to Render (8 minutes)

### Quick Steps:
1. Go to https://render.com/ → Sign up with GitHub
2. Click "New +" → "Web Service"
3. Connect your repository
4. Settings:
   - Name: `leveluped-backend`
   - Build: `npm install`
   - Start: `npm start`
   - Instance: Free
5. Add Environment Variables (click Advanced):
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://admin:Sakethbalu@m0.8vwfsmh.mongodb.net/?appName=M0
   JWT_SECRET=your_strong_secret_here
   SESSION_SECRET=your_strong_secret_here
   FRONTEND_URL=https://your-app.vercel.app
   ```
6. Click "Create Web Service"
7. Wait 5-10 minutes
8. **COPY YOUR URL:** `https://your-backend.onrender.com`

---

## Step 3: Deploy Frontend to Vercel (5 minutes)

### Quick Steps:
1. Go to https://vercel.com/ → Sign up with GitHub
2. Click "Add New..." → "Project"
3. Import your repository
4. Settings:
   - Framework: Vite
   - Root Directory: `client`
   - Build: `npm run build`
   - Output: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
6. Click "Deploy"
7. Wait 2-3 minutes
8. **COPY YOUR URL:** `https://your-app.vercel.app`

---

## Step 4: Connect Them (2 minutes)

### Update Backend:
1. Go back to Render dashboard
2. Click your service → Environment
3. Update `FRONTEND_URL` to your Vercel URL
4. Save (auto-redeploys)

### Update CORS (if needed):
Your server.js already has CORS configured, but verify it includes your production URLs.

---

## Step 5: Test Your Live App! (1 minute)

1. Go to your Vercel URL
2. Try registering a user
3. Try logging in
4. Everything should work!

---

## If Using OAuth

### Update Callback URLs:

**Google:**
- Go to https://console.cloud.google.com/
- Add: `https://your-backend.onrender.com/api/auth/google/callback`

**GitHub:**
- Go to https://github.com/settings/developers
- Update: `https://your-backend.onrender.com/api/auth/github/callback`

**LinkedIn:**
- Go to https://www.linkedin.com/developers/apps
- Add: `https://your-backend.onrender.com/api/auth/linkedin/callback`

---

## Troubleshooting

### Backend not responding?
- Check Render logs
- Verify environment variables
- Wait for initial deployment (can take 10 min)

### Frontend shows errors?
- Check VITE_API_URL is correct
- Verify backend is deployed
- Check browser console

### CORS errors?
- Update server.js CORS configuration
- Redeploy backend

---

## Your Live URLs

After deployment, you'll have:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.onrender.com
- **API:** https://your-backend.onrender.com/api

---

## Cost

- **Render Free Tier:** $0/month
- **Vercel Free Tier:** $0/month
- **MongoDB Atlas Free:** $0/month
- **Total:** $0/month 🎉

---

## Next Steps

1. ✅ Share your live URL
2. ✅ Test all features
3. ✅ Add custom domain (optional)
4. ✅ Monitor usage
5. ✅ Add more features

---

**Total Time:** ~20 minutes
**Difficulty:** Easy
**Cost:** Free

Ready? Follow: **DEPLOY_LIVE_NOW.md** for detailed steps!
