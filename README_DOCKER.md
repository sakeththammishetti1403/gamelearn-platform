# 🐳 Docker Deployment - README

## Quick Links

- 🚀 **[START HERE](START_HERE.md)** - Begin here for deployment
- ⚡ **[Quick Start](DOCKER_QUICK_START.md)** - Fast commands and reference
- 📖 **[Complete Guide](DOCKER_DEPLOYMENT.md)** - Detailed instructions
- 📊 **[Summary](DOCKER_DEPLOYMENT_SUMMARY.md)** - Overview and comparison

---

## What is This?

Your application has been containerized with Docker, making it easy to deploy anywhere:
- ☁️ Cloud platforms (Railway, Fly.io, Heroku)
- 🖥️ VPS servers (DigitalOcean, AWS, Linode)
- 💻 Local machine (for testing)

---

## Fastest Way to Deploy (10 Minutes)

### Railway.app (Recommended - No Docker Install Needed)

1. **Push to GitHub:**
   ```powershell
   git add .
   git commit -m "Add Docker deployment"
   git push origin main
   ```

2. **Deploy to Railway:**
   - Go to https://railway.app/
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Add environment variables (see below)
   - Deploy!

3. **Environment Variables:**
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://admin:Sakethbalu@m0.8vwfsmh.mongodb.net/?appName=M0
   JWT_SECRET=<generate with command below>
   SESSION_SECRET=<generate with command below>
   FRONTEND_URL=https://your-app.railway.app
   BACKEND_URL=https://your-app.railway.app/api
   ```

4. **Generate Secrets:**
   ```powershell
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Run twice for two different secrets.

5. **Done!** Your app is live at: https://your-app.railway.app

---

## Local Testing (If You Have Docker)

### Quick Start
```powershell
# Automated
.\docker-deploy.ps1

# Or manual
docker build -t leveluped-app .
docker-compose up -d
```

### Access
- App: http://localhost:5000
- Health: http://localhost:5000/health

### Stop
```powershell
docker-compose down
```

---

## Files Overview

| File | Purpose |
|------|---------|
| `Dockerfile` | Builds your Docker image |
| `docker-compose.yml` | Runs containers |
| `.dockerignore` | Excludes files from build |
| `.env.production` | Production config template |
| `docker-deploy.ps1` | Automated deployment script |
| `fly.toml` | Fly.io configuration |

---

## Deployment Options

| Platform | Time | Cost | Difficulty |
|----------|------|------|------------|
| **Railway.app** | 10 min | Free | ⭐ Easy |
| **Fly.io** | 10 min | Free | ⭐⭐ Medium |
| **DigitalOcean** | 15 min | $4/mo | ⭐⭐ Medium |
| **Heroku** | 10 min | $7/mo | ⭐ Easy |
| **Local Docker** | 5 min | Free | ⭐ Easy |

---

## Need Help?

1. **Quick Start:** [DOCKER_QUICK_START.md](DOCKER_QUICK_START.md)
2. **Complete Guide:** [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)
3. **Troubleshooting:** Check the guides above

---

## What's Included?

✅ Frontend (React + Vite) - Built and optimized
✅ Backend (Node.js + Express) - Production ready
✅ Socket.IO - Real-time features
✅ Health checks - Auto-restart
✅ Multi-stage build - Optimized image
✅ Environment variables - Secure config

---

## Quick Commands

```powershell
# Build
docker build -t leveluped-app .

# Run
docker-compose up -d

# Logs
docker-compose logs -f

# Stop
docker-compose down

# Restart
docker-compose restart
```

---

## Environment Variables Required

```env
NODE_ENV=production
MONGO_URI=your_mongodb_connection
JWT_SECRET=generate_64_char_secret
SESSION_SECRET=generate_64_char_secret
FRONTEND_URL=your_deployed_url
BACKEND_URL=your_deployed_url/api
```

Generate secrets:
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Next Steps

1. ✅ Read [START_HERE.md](START_HERE.md)
2. ✅ Choose deployment platform
3. ✅ Generate secrets
4. ✅ Deploy!
5. ✅ Test your live app

---

## Support

- **Documentation:** See markdown files in this directory
- **Issues:** Check troubleshooting sections in guides
- **Updates:** Pull latest code and rebuild

---

**Your app is ready to deploy!** 🚀

Start with [START_HERE.md](START_HERE.md) for step-by-step instructions.
