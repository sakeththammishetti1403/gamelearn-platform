# Deploy to Render.com - Step by Step Guide

## Why Render Instead of Railway?
- More reliable Docker support
- Better healthcheck handling
- Clearer error messages
- Free tier with 750 hours/month (24/7 coverage)
- Automatic SSL certificates

## Prerequisites
✅ Your code is already Docker-ready
✅ GitHub repo is up to date
✅ MongoDB Atlas connection string ready

## Step-by-Step Deployment

### Step 1: Sign Up for Render
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with your GitHub account
4. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. Click "Connect" next to your `gamelearn-platform` repository
4. If you don't see it, click "Configure account" and grant access

### Step 3: Configure the Service

**Basic Settings:**
- **Name:** `leveluped-app` (or any name you prefer)
- **Region:** Choose closest to you (e.g., Frankfurt for Europe)
- **Branch:** `main`
- **Root Directory:** Leave empty
- **Environment:** `Docker`
- **Dockerfile Path:** `Dockerfile` (default)

**Instance Type:**
- Select **Free** (0$/month, 750 hours)

### Step 4: Add Environment Variables

Click "Advanced" and add these environment variables:

```
MONGO_URI=mongodb+srv://admin:Sakethbalu@m0.8vwfsmh.mongodb.net/?appName=M0

JWT_SECRET=250cbd11b66fe1e87413d5aa5f5752c53f2110f1bb1832e35a70309bd71580d0608c27105b538add2790c083dd144c954ecde30681ba21f41d19d24d765508b6

SESSION_SECRET=d2a1cd8a22946f8e02c38f0fdb73755b5f3c52d6b9bec3ce0b5e311c5dc37f2d50df8cf156608a39205eb09a067cd283a2186c8298a425b5b6149f3a487b5583

NODE_ENV=production
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Build the Docker image
   - Deploy the container
   - Assign a URL

### Step 6: Monitor Deployment
- Watch the logs in real-time
- Build typically takes 2-3 minutes
- You'll see the same build process as Railway

### Step 7: Get Your URL
Once deployed, Render will provide a URL like:
```
https://leveluped-app.onrender.com
```

### Step 8: Update CORS (After Deployment)
Once you have the Render URL, update `server.js`:

Add your Render URL to the CORS origins array:
```javascript
origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'https://leveluped.vercel.app',
    'https://your-app-name.onrender.com',  // Add this
    process.env.FRONTEND_URL
].filter(Boolean),
```

Then commit and push - Render will auto-redeploy.

## Expected Timeline
- Sign up: 2 minutes
- Configure service: 3 minutes
- First deployment: 3-5 minutes
- **Total: ~10 minutes**

## Advantages Over Railway
✅ More stable healthchecks
✅ Better Docker networking
✅ Clearer deployment logs
✅ Free SSL certificates
✅ Better documentation
✅ More reliable free tier

## After Successful Deployment

### Test These Endpoints:
1. Health: `https://your-app.onrender.com/health`
2. Test: `https://your-app.onrender.com/test`
3. Frontend: `https://your-app.onrender.com/`

### Add Optional Environment Variables:
```
FRONTEND_URL=https://your-app.onrender.com
BACKEND_URL=https://your-app.onrender.com/api
```

## Troubleshooting

### If Build Fails:
- Check the build logs in Render dashboard
- Verify Dockerfile is correct
- Ensure all dependencies are in package.json

### If Healthcheck Fails:
- Render uses `/` by default for healthcheck
- Our `/health` endpoint should work fine
- Check deploy logs for server startup errors

### If 503 Errors:
- Free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Upgrade to paid tier ($7/month) for always-on

## Free Tier Limitations
- 750 hours/month (enough for 24/7 if only one service)
- Spins down after 15 minutes of inactivity
- 512 MB RAM
- Shared CPU
- 100 GB bandwidth/month

## Next Steps After Deployment
1. ✅ Test all features
2. ✅ Set up custom domain (optional)
3. ✅ Configure OAuth apps with Render URL
4. ✅ Monitor performance
5. ✅ Consider upgrading if needed

## Cost Comparison
- **Render Free:** $0/month (with spin-down)
- **Render Starter:** $7/month (always-on, 512MB RAM)
- **Railway Free:** $5 credit/month (often not enough)
- **Railway Pro:** $20/month minimum

## Support
- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Status Page: https://status.render.com

---

**Ready to deploy? Follow the steps above and your app will be live in ~10 minutes!**
