# ✅ Pre-Deployment Checklist

## Before You Deploy

Go through this checklist to ensure smooth deployment:

### 1. Code Preparation

- [ ] All code committed to Git
- [ ] No sensitive data in code (passwords, keys, etc.)
- [ ] .gitignore includes .env file
- [ ] package.json has correct scripts
- [ ] Dependencies are up to date

### 2. Environment Variables

- [ ] JWT_SECRET is strong and random
- [ ] SESSION_SECRET is strong and random
- [ ] MONGO_URI is correct
- [ ] OAuth credentials ready (if using OAuth)

### 3. Database

- [ ] MongoDB Atlas is set up
- [ ] Database allows connections from anywhere (0.0.0.0/0)
- [ ] Database has test data (optional)
- [ ] Database credentials are correct

### 4. Backend

- [ ] Health endpoint works: /health
- [ ] Auth endpoints work: /api/auth/register, /api/auth/login
- [ ] CORS configured for production
- [ ] Error handling in place
- [ ] Logging configured

### 5. Frontend

- [ ] Build works locally: `cd client && npm run build`
- [ ] API URL is configurable via environment variable
- [ ] No hardcoded localhost URLs
- [ ] Error handling in place

### 6. OAuth (If Using)

- [ ] Google OAuth app created
- [ ] GitHub OAuth app created
- [ ] LinkedIn OAuth app created
- [ ] All credentials copied
- [ ] Ready to update callback URLs after deployment

### 7. Git Repository

- [ ] Code pushed to GitHub
- [ ] Repository is public or accessible to Vercel/Render
- [ ] Main branch is up to date
- [ ] No merge conflicts

---

## Quick Verification Commands

### Test Backend Locally
```bash
npm start
# Should start without errors
```

### Test Frontend Build
```bash
cd client
npm run build
# Should build successfully
```

### Test API Endpoints
```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/auth/oauth-status
```

---

## Generate Strong Secrets

Use these commands to generate strong secrets:

### PowerShell
```powershell
# JWT Secret
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})

# Session Secret
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### Online Tool
Go to: https://randomkeygen.com/
Use "CodeIgniter Encryption Keys" (256-bit)

---

## Common Issues to Check

### Issue: Build Fails
- Check package.json scripts
- Verify all dependencies are installed
- Check for syntax errors

### Issue: Database Connection Fails
- Verify MONGO_URI is correct
- Check MongoDB Atlas network access
- Ensure database user has correct permissions

### Issue: CORS Errors
- Update CORS configuration in server.js
- Add production URLs to allowed origins

### Issue: OAuth Not Working
- Verify callback URLs are correct
- Check OAuth credentials
- Ensure HTTPS is used in production

---

## Ready to Deploy?

If all items are checked:
1. ✅ Follow DEPLOY_LIVE_NOW.md
2. ✅ Deploy backend first
3. ✅ Then deploy frontend
4. ✅ Update OAuth callbacks
5. ✅ Test everything

---

**Time to Deploy:** ~20 minutes
**Next Step:** Open DEPLOY_LIVE_NOW.md
