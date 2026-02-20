# Railway Deployment Fix - Port Mismatch Resolution

## Problem Identified
The 502 errors were caused by a **port mismatch**:
- Railway assigns `PORT=8080` via environment variable
- Dockerfile was exposing port `5000`
- Server correctly binds to `process.env.PORT` (8080)
- But Docker EXPOSE directive didn't match

## Fix Applied
1. Updated `Dockerfile` to `EXPOSE 8080` instead of `5000`
2. Reduced healthcheck timeout from 300s to 100s for faster feedback
3. Server already correctly uses `process.env.PORT || 5000`

## Deployment Steps

### 1. Commit and Push Changes
```bash
git add Dockerfile railway.toml
git commit -m "fix: update Docker EXPOSE port to match Railway PORT assignment"
git push origin main
```

### 2. Railway Will Auto-Deploy
Railway is connected to your GitHub repo and will automatically:
- Detect the changes
- Rebuild the Docker image
- Deploy with correct port configuration

### 3. Verify Deployment
Once deployed, test these endpoints:
- Health: https://leveluped-app-production-94a3.up.railway.app/health
- Test: https://leveluped-app-production-94a3.up.railway.app/test
- Frontend: https://leveluped-app-production-94a3.up.railway.app/

## Why This Fixes the 502 Error

Railway's internal proxy expects the container to listen on the PORT it assigns (8080). When the EXPOSE directive doesn't match, Docker's networking layer can have issues routing traffic correctly, even though the application binds to the right port.

The EXPOSE directive is metadata that:
1. Documents which port the container listens on
2. Helps Docker networking route traffic correctly
3. Is used by Railway's proxy to connect to your app

## Current Configuration

### Dockerfile
- Base: Node 18
- Build: Backend + Frontend (monolithic)
- Port: 8080 (matches Railway's PORT env var)
- Command: `node server.js`

### server.js
- Binds to: `0.0.0.0:${PORT}` (correct for Railway)
- Health check: `/health` endpoint
- Static files: Serves React app from `client/dist`

### railway.toml
- Builder: Dockerfile
- Health check: `/health` with 100s timeout
- Restart policy: ON_FAILURE with 10 retries

## Expected Result
After this deployment:
- ✅ Build succeeds (30-45 seconds)
- ✅ Server starts on port 8080
- ✅ Health check passes
- ✅ Railway proxy connects successfully
- ✅ No more 502 errors
- ✅ Application accessible at Railway URL

## If Still Failing
If 502 errors persist after this fix:
1. Check Railway dashboard for any service configuration issues
2. Verify environment variables are set (MONGO_URI, JWT_SECRET, SESSION_SECRET)
3. Check if Railway has any region-specific networking issues
4. Contact Railway support with Request ID from error page

## Next Steps After Successful Deployment
1. Add FRONTEND_URL and BACKEND_URL environment variables in Railway
2. Test OAuth flows (will need OAuth app credentials)
3. Test all API endpoints
4. Monitor performance and logs
