# 🐳 Docker Deployment Guide

## Overview

Deploy your application using Docker in 3 simple steps:
1. Build the Docker image
2. Configure environment variables
3. Run with Docker Compose

**Time:** 10 minutes
**Cost:** Depends on hosting provider (can be free with many providers)

---

## Prerequisites

### Install Docker
- **Windows:** Download Docker Desktop from https://www.docker.com/products/docker-desktop
- **Mac:** Download Docker Desktop from https://www.docker.com/products/docker-desktop
- **Linux:** 
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  ```

Verify installation:
```powershell
docker --version
docker-compose --version
```

---

## Quick Start (Local Testing)

### Step 1: Build the Image
```powershell
docker build -t leveluped-app .
```

This will:
- Build the frontend (React + Vite)
- Install backend dependencies
- Create a production-ready image
- Takes 5-10 minutes first time

### Step 2: Run with Docker Compose
```powershell
docker-compose up -d
```

### Step 3: Access Your App
Open browser: http://localhost:5000

The app serves both frontend and backend on port 5000.

### Stop the App
```powershell
docker-compose down
```

---

## Production Deployment

### Step 1: Generate Strong Secrets

Run this command to generate secure secrets:
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run it twice to get two different secrets for JWT_SECRET and SESSION_SECRET.

### Step 2: Create Production Environment File

Create a file named `.env.production.local`:

```env
# SERVER
NODE_ENV=production
PORT=5000
BACKEND_URL=http://your-domain.com/api

# DATABASE
MONGO_URI=mongodb+srv://admin:Sakethbalu@m0.8vwfsmh.mongodb.net/?appName=M0

# AUTH - Use the secrets you generated above
JWT_SECRET=paste_your_generated_secret_here
SESSION_SECRET=paste_your_other_generated_secret_here

# FRONTEND
FRONTEND_URL=http://your-domain.com

# OAUTH (Optional - leave as is if not using OAuth)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
```

### Step 3: Update Frontend API URL

Edit `client/vite.config.js` and update the production API URL:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(
      process.env.NODE_ENV === 'production' 
        ? 'http://your-domain.com/api'  // Update this
        : 'http://localhost:5000/api'
    )
  }
})
```

### Step 4: Build Production Image

```powershell
docker build -t leveluped-app:production .
```

### Step 5: Run in Production Mode

```powershell
docker-compose --env-file .env.production.local up -d
```

---

## Deployment Options

### Option 1: Deploy to Any VPS (DigitalOcean, AWS EC2, etc.)

1. **Get a VPS:**
   - DigitalOcean Droplet ($4/month)
   - AWS EC2 t2.micro (Free tier)
   - Linode ($5/month)
   - Vultr ($2.50/month)

2. **SSH into your server:**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

4. **Clone your repository:**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

5. **Create .env.production.local** with your production values

6. **Build and run:**
   ```bash
   docker build -t leveluped-app .
   docker-compose --env-file .env.production.local up -d
   ```

7. **Access your app:**
   - http://your-server-ip:5000

### Option 2: Deploy to Railway.app (Easiest)

1. Go to https://railway.app/
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect Dockerfile
6. Add environment variables in Railway dashboard
7. Deploy!
8. Get a free domain: `your-app.railway.app`

### Option 3: Deploy to Fly.io (Free Tier)

1. Install Fly CLI:
   ```powershell
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. Login:
   ```powershell
   fly auth login
   ```

3. Launch app:
   ```powershell
   fly launch
   ```

4. Set environment variables:
   ```powershell
   fly secrets set JWT_SECRET=your_secret
   fly secrets set SESSION_SECRET=your_secret
   fly secrets set MONGO_URI=your_mongo_uri
   ```

5. Deploy:
   ```powershell
   fly deploy
   ```

### Option 4: Deploy to Heroku

1. Install Heroku CLI
2. Login:
   ```powershell
   heroku login
   ```

3. Create app:
   ```powershell
   heroku create your-app-name
   ```

4. Set stack to container:
   ```powershell
   heroku stack:set container
   ```

5. Set environment variables:
   ```powershell
   heroku config:set JWT_SECRET=your_secret
   heroku config:set SESSION_SECRET=your_secret
   heroku config:set MONGO_URI=your_mongo_uri
   ```

6. Deploy:
   ```powershell
   git push heroku main
   ```

---

## Docker Commands Reference

### Build Commands
```powershell
# Build image
docker build -t leveluped-app .

# Build with no cache (fresh build)
docker build --no-cache -t leveluped-app .

# Build for specific platform
docker build --platform linux/amd64 -t leveluped-app .
```

### Run Commands
```powershell
# Run with docker-compose
docker-compose up -d

# Run with specific env file
docker-compose --env-file .env.production.local up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Management Commands
```powershell
# List running containers
docker ps

# View logs
docker logs <container-id>

# Execute command in container
docker exec -it <container-id> sh

# View container stats
docker stats

# Remove unused images
docker image prune -a
```

---

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | production |
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | Secret for JWT tokens | 64-char random string |
| SESSION_SECRET | Secret for sessions | 64-char random string |
| FRONTEND_URL | Frontend URL | http://your-domain.com |
| BACKEND_URL | Backend API URL | http://your-domain.com/api |
| GOOGLE_CLIENT_ID | Google OAuth ID | Optional |
| GOOGLE_CLIENT_SECRET | Google OAuth Secret | Optional |
| GITHUB_CLIENT_ID | GitHub OAuth ID | Optional |
| GITHUB_CLIENT_SECRET | GitHub OAuth Secret | Optional |
| LINKEDIN_CLIENT_ID | LinkedIn OAuth ID | Optional |
| LINKEDIN_CLIENT_SECRET | LinkedIn OAuth Secret | Optional |

---

## Troubleshooting

### Build Fails

**Error: "npm install failed"**
- Check your internet connection
- Try: `docker build --no-cache -t leveluped-app .`

**Error: "Cannot find module"**
- Make sure all dependencies are in package.json
- Delete node_modules and rebuild

### Container Won't Start

**Check logs:**
```powershell
docker-compose logs
```

**Common issues:**
- MongoDB connection failed → Check MONGO_URI
- Port already in use → Change PORT in .env
- Missing environment variables → Check .env file

### App Not Accessible

**Check if container is running:**
```powershell
docker ps
```

**Check health:**
```powershell
docker exec <container-id> wget -O- http://localhost:5000/health
```

**Check firewall:**
- Make sure port 5000 is open
- On VPS: `sudo ufw allow 5000`

### Database Connection Issues

**MongoDB Atlas:**
- Whitelist your server IP in MongoDB Atlas
- Or allow all IPs: 0.0.0.0/0

**Check connection:**
```powershell
docker exec -it <container-id> sh
node -e "require('mongoose').connect(process.env.MONGO_URI).then(() => console.log('Connected')).catch(e => console.log(e))"
```

---

## Production Checklist

- [ ] Generated strong JWT_SECRET and SESSION_SECRET
- [ ] Updated .env.production.local with production values
- [ ] Updated FRONTEND_URL and BACKEND_URL
- [ ] MongoDB Atlas allows connections from your server IP
- [ ] Built Docker image successfully
- [ ] Tested locally with docker-compose
- [ ] Deployed to production server
- [ ] Tested registration and login
- [ ] Set up OAuth (if needed)
- [ ] Configured domain name (optional)
- [ ] Set up SSL/HTTPS (recommended)

---

## SSL/HTTPS Setup (Recommended)

### Using Nginx Reverse Proxy

1. Install Nginx on your server
2. Install Certbot for Let's Encrypt SSL
3. Configure Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Get SSL certificate:
```bash
sudo certbot --nginx -d your-domain.com
```

---

## Monitoring

### View Logs
```powershell
docker-compose logs -f
```

### Monitor Resources
```powershell
docker stats
```

### Health Check
```powershell
curl http://localhost:5000/health
```

---

## Scaling

### Run Multiple Instances
```powershell
docker-compose up -d --scale app=3
```

### Use Load Balancer
Add Nginx or Traefik as reverse proxy to distribute traffic.

---

## Backup

### Backup MongoDB
```bash
mongodump --uri="your_mongo_uri" --out=/backup
```

### Backup Docker Volumes
```powershell
docker run --rm -v app_data:/data -v ${PWD}:/backup alpine tar czf /backup/backup.tar.gz /data
```

---

## Cost Comparison

| Provider | Cost | Features |
|----------|------|----------|
| Railway.app | Free tier available | Auto-deploy, easy setup |
| Fly.io | Free tier (3 VMs) | Global deployment |
| DigitalOcean | $4/month | Full control, VPS |
| AWS EC2 | Free tier 1 year | Scalable |
| Heroku | $7/month | Easy deployment |
| VPS (Vultr/Linode) | $2.50-5/month | Full control |

---

## Next Steps

1. ✅ Test locally with Docker
2. ✅ Choose deployment provider
3. ✅ Deploy to production
4. ✅ Set up domain name
5. ✅ Configure SSL/HTTPS
6. ✅ Set up monitoring
7. ✅ Configure backups

---

**Your app is now containerized and ready to deploy anywhere!** 🚀

Choose your deployment option and follow the steps above.
