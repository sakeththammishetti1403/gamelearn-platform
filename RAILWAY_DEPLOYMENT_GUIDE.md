# 🚂 Railway.app Deployment Guide

## ✅ Your Code is Ready!

Your code has been pushed to GitHub and is ready for Railway deployment.

---

## Step-by-Step Deployment (10 Minutes)

### Step 1: Sign Up for Railway (2 minutes)

1. **Go to Railway:**
   - Open: https://railway.app/

2. **Sign Up:**
   - Click "Login" or "Start a New Project"
   - Click "Login with GitHub"
   - Authorize Railway to access your GitHub account

3. **Verify Email:**
   - Check your email and verify if needed

---

### Step 2: Create New Project (1 minute)

1. **Click "New Project"**
   - You'll see this on your Railway dashboard

2. **Select "Deploy from GitHub repo"**

3. **Choose Your Repository:**
   - Find: `gamelearn-platform` (or your repo name)
   - Click on it

4. **Railway Auto-Detects:**
   - ✅ Railway will automatically detect your Dockerfile
   - ✅ No additional configuration needed!

---

### Step 3: Add Environment Variables (5 minutes)

1. **Click on your service** (it will be building)

2. **Go to "Variables" tab**

3. **Click "Add Variable"** and add these one by one:

#### Required Variables (Copy these exactly):

```env
NODE_ENV=production
```

```env
PORT=5000
```

```env
MONGO_URI=mongodb+srv://admin:Sakethbalu@m0.8vwfsmh.mongodb.net/?appName=M0
```

```env
JWT_SECRET=250cbd11b66fe1e87413d5aa5f5752c53f2110f1bb1832e35a70309bd71580d0608c27105b538add2790c083dd144c954ecde30681ba21f41d19d24d765508b6
```

```env
SESSION_SECRET=d2a1cd8a22946f8e02c38f0fdb73755b5f3c52d6b9bec3ce0b5e311c5dc37f2d50df8cf156608a39205eb09a067cd283a2186c8298a425b5b6149f3a487b5583
```

**Note:** For FRONTEND_URL and BACKEND_URL, we'll add these after the first deployment when we get the Railway URL.

4. **Click "Deploy"** or wait for auto-deploy

---

### Step 4: Get Your Railway URL (1 minute)

1. **Wait for deployment to complete** (5-10 minutes)
   - You'll see "Success" when done
   - Watch the build logs if you want

2. **Get Your URL:**
   - Click "Settings" tab
   - Scroll to "Domains"
   - Click "Generate Domain"
   - You'll get a URL like: `https://your-app.up.railway.app`
   - **COPY THIS URL!**

---

### Step 5: Update Environment Variables with Real URL (1 minute)

1. **Go back to "Variables" tab**

2. **Add these two variables** (replace with your actual Railway URL):

```env
FRONTEND_URL=https://your-app.up.railway.app
```

```env
BACKEND_URL=https://your-app.up.railway.app/api
```

**Example:** If your URL is `https://gamelearn-production.up.railway.app`, then:
- FRONTEND_URL=https://gamelearn-production.up.railway.app
- BACKEND_URL=https://gamelearn-production.up.railway.app/api

3. **Save** - Railway will automatically redeploy

---

### Step 6: Test Your Live App! (1 minute)

1. **Open your Railway URL** in a browser

2. **Test Registration:**
   - Click "Register"
   - Fill in the form
   - Submit
   - Should work! ✅

3. **Test Login:**
   - Login with your credentials
   - Should redirect to dashboard ✅

4. **Check Health:**
   - Visit: `https://your-app.up.railway.app/health`
   - Should show: `{"status":"active",...}` ✅

---

## 🎉 You're Live!

Your app is now deployed and accessible at your Railway URL!

---

## Optional: Add OAuth (If You Want Social Login)

If you want to enable Google/GitHub/LinkedIn login:

### 1. Add OAuth Environment Variables

Go to Railway Variables tab and add:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

### 2. Update OAuth Callback URLs

For each OAuth provider, update the callback URLs to your Railway domain:

**Google:**
- Callback: `https://your-app.up.railway.app/api/auth/google/callback`

**GitHub:**
- Callback: `https://your-app.up.railway.app/api/auth/github/callback`

**LinkedIn:**
- Callback: `https://your-app.up.railway.app/api/auth/linkedin/callback`

See `SETUP_OAUTH_STEP_BY_STEP.md` for detailed OAuth setup instructions.

---

## Railway Dashboard Features

### View Logs
- Click "Deployments" tab
- Click on latest deployment
- View real-time logs

### Monitor Resources
- Click "Metrics" tab
- See CPU, Memory, Network usage

### Redeploy
- Click "Deployments" tab
- Click "Redeploy" on any deployment

### Environment Variables
- Click "Variables" tab
- Add/Edit/Delete variables
- Changes trigger auto-redeploy

---

## Troubleshooting

### Build Failed

**Check build logs:**
1. Go to "Deployments" tab
2. Click on failed deployment
3. Read error messages

**Common issues:**
- Missing dependencies → Check package.json
- Build timeout → Contact Railway support
- Out of memory → Upgrade plan

### App Not Loading

**Check deployment status:**
1. Make sure deployment shows "Success"
2. Check logs for errors
3. Verify all environment variables are set

**Test health endpoint:**
```
https://your-app.up.railway.app/health
```

### Database Connection Failed

**Check MongoDB:**
1. Verify MONGO_URI is correct
2. Check MongoDB Atlas allows Railway IPs
3. In MongoDB Atlas → Network Access → Add IP: `0.0.0.0/0` (allow all)

### OAuth Not Working

**Update callback URLs:**
1. Make sure OAuth callback URLs use your Railway domain
2. Check OAuth credentials are correct
3. Verify OAuth apps are in production mode

---

## Railway Free Tier

### What You Get:
- ✅ 500 hours/month (enough for 1 app running 24/7)
- ✅ $5 free credit/month
- ✅ Free SSL/HTTPS
- ✅ Free domain (*.up.railway.app)
- ✅ Automatic deployments
- ✅ Environment variables
- ✅ Logs and metrics

### Limitations:
- App may sleep after inactivity (on free tier)
- Limited resources (512MB RAM, 1 vCPU)
- Upgrade to Pro for more resources

---

## Custom Domain (Optional)

### Add Your Own Domain:

1. **In Railway:**
   - Go to "Settings" → "Domains"
   - Click "Custom Domain"
   - Enter your domain: `yourdomain.com`

2. **In Your Domain Provider:**
   - Add CNAME record:
     - Name: `@` or `www`
     - Value: (Railway will provide this)

3. **Wait for DNS propagation** (5-30 minutes)

4. **Update Environment Variables:**
   - FRONTEND_URL=https://yourdomain.com
   - BACKEND_URL=https://yourdomain.com/api

5. **Update OAuth callbacks** (if using OAuth)

---

## Monitoring & Maintenance

### Check App Health
```
https://your-app.up.railway.app/health
```

### View Logs
- Railway Dashboard → Deployments → Latest → Logs

### Update App
1. Push changes to GitHub
2. Railway auto-deploys
3. Check deployment status

### Rollback
1. Go to "Deployments" tab
2. Find previous successful deployment
3. Click "Redeploy"

---

## Cost Estimate

### Free Tier (Current):
- **Cost:** $0/month
- **Hours:** 500/month
- **Good for:** Development, small projects

### Hobby Plan:
- **Cost:** $5/month
- **Hours:** Unlimited
- **Good for:** Production apps

### Pro Plan:
- **Cost:** $20/month
- **Features:** More resources, priority support
- **Good for:** High-traffic apps

---

## Next Steps

1. ✅ **Test your live app** - Make sure everything works
2. ✅ **Share your URL** - Show it to your team/users
3. ✅ **Set up monitoring** - Watch logs and metrics
4. ✅ **Add custom domain** (optional)
5. ✅ **Enable OAuth** (optional)
6. ✅ **Upgrade plan** if needed

---

## Your Deployment Info

**Repository:** gamelearn-platform
**Platform:** Railway.app
**Region:** Auto-selected (usually US)
**URL:** https://your-app.up.railway.app (update after deployment)

**Environment Variables Set:**
- ✅ NODE_ENV=production
- ✅ PORT=5000
- ✅ MONGO_URI (configured)
- ✅ JWT_SECRET (generated)
- ✅ SESSION_SECRET (generated)
- ⏳ FRONTEND_URL (add after first deploy)
- ⏳ BACKEND_URL (add after first deploy)

---

## Support

**Railway Documentation:**
- https://docs.railway.app/

**Railway Discord:**
- https://discord.gg/railway

**Your Guides:**
- SETUP_OAUTH_STEP_BY_STEP.md (for OAuth)
- DOCKER_DEPLOYMENT.md (for other platforms)
- DEPLOYMENT_CHECKLIST.md (deployment checklist)

---

## Summary

✅ Code pushed to GitHub
✅ Secrets generated
✅ Ready to deploy to Railway
✅ All environment variables prepared

**Time to deploy:** 10 minutes
**Cost:** $0 (free tier)
**Difficulty:** ⭐ Easy

---

## Quick Checklist

- [ ] Signed up for Railway.app
- [ ] Connected GitHub account
- [ ] Created new project from GitHub repo
- [ ] Added all environment variables
- [ ] Waited for deployment to complete
- [ ] Got Railway URL
- [ ] Updated FRONTEND_URL and BACKEND_URL
- [ ] Tested registration
- [ ] Tested login
- [ ] Checked health endpoint
- [ ] Shared live URL

---

**Your app is ready to go live on Railway!** 🚀

Follow the steps above and you'll be deployed in 10 minutes!
