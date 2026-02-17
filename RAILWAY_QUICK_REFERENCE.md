# 🚂 Railway Deployment - Quick Reference

## 🔗 Links

**Railway:** https://railway.app/
**Your GitHub Repo:** https://github.com/sakeththammishetti1403/gamelearn-platform

---

## 📋 Environment Variables (Copy & Paste)

### Add these in Railway Variables tab:

```
NODE_ENV=production
```

```
PORT=5000
```

```
MONGO_URI=mongodb+srv://admin:Sakethbalu@m0.8vwfsmh.mongodb.net/?appName=M0
```

```
JWT_SECRET=250cbd11b66fe1e87413d5aa5f5752c53f2110f1bb1832e35a70309bd71580d0608c27105b538add2790c083dd144c954ecde30681ba21f41d19d24d765508b6
```

```
SESSION_SECRET=d2a1cd8a22946f8e02c38f0fdb73755b5f3c52d6b9bec3ce0b5e311c5dc37f2d50df8cf156608a39205eb09a067cd283a2186c8298a425b5b6149f3a487b5583
```

### Add these AFTER first deployment (replace with your Railway URL):

```
FRONTEND_URL=https://your-app.up.railway.app
```

```
BACKEND_URL=https://your-app.up.railway.app/api
```

---

## 🚀 Deployment Steps

1. **Go to:** https://railway.app/
2. **Login with GitHub**
3. **New Project** → Deploy from GitHub repo
4. **Select:** gamelearn-platform
5. **Add environment variables** (see above)
6. **Wait for deployment** (5-10 minutes)
7. **Generate domain** in Settings → Domains
8. **Update FRONTEND_URL and BACKEND_URL** with your Railway URL
9. **Test:** Visit your Railway URL
10. **Done!** ✅

---

## 🧪 Testing Checklist

- [ ] App loads: https://your-app.up.railway.app
- [ ] Health check: https://your-app.up.railway.app/health
- [ ] Register a user
- [ ] Login with user
- [ ] Access dashboard
- [ ] No console errors

---

## 🔧 Useful Commands

### View Logs
Railway Dashboard → Deployments → Latest → View Logs

### Redeploy
Railway Dashboard → Deployments → Click "Redeploy"

### Update Code
```powershell
git add .
git commit -m "Update"
git push origin main
```
Railway auto-deploys!

---

## 🆘 Troubleshooting

### Build Failed
- Check Railway logs
- Verify Dockerfile exists
- Check package.json

### App Not Loading
- Check deployment status (should be "Success")
- Verify all environment variables are set
- Check health endpoint

### Database Connection Failed
- Verify MONGO_URI is correct
- MongoDB Atlas → Network Access → Add IP: 0.0.0.0/0

### OAuth Not Working
- Update OAuth callback URLs to Railway domain
- Check OAuth credentials in variables

---

## 💰 Cost

**Free Tier:**
- 500 hours/month
- $5 credit/month
- **Total: $0/month** ✅

---

## 📞 Support

**Full Guide:** RAILWAY_DEPLOYMENT_GUIDE.md
**Railway Docs:** https://docs.railway.app/
**Railway Discord:** https://discord.gg/railway

---

## ✅ Status

- [x] Code pushed to GitHub
- [x] Secrets generated
- [ ] Railway account created
- [ ] Project deployed
- [ ] Environment variables added
- [ ] App tested
- [ ] Live URL obtained

---

**Time to deploy:** 10 minutes
**Difficulty:** ⭐ Easy
**Cost:** $0

**Let's deploy!** 🚀
