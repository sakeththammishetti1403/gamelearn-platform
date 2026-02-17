# 🐳 Docker Quick Start Guide

## Prerequisites

Install Docker Desktop: https://www.docker.com/products/docker-desktop

Verify installation:
```powershell
docker --version
docker-compose --version
```

---

## Option 1: Automated Deployment (Easiest)

Run the deployment script:
```powershell
.\docker-deploy.ps1
```

Select option:
- **1** - Local testing (quick test)
- **2** - Production deployment
- **3** - Build only
- **4** - Stop containers

---

## Option 2: Manual Deployment

### Local Testing (5 minutes)

1. **Build the image:**
   ```powershell
   docker build -t leveluped-app .
   ```

2. **Start the app:**
   ```powershell
   docker-compose up -d
   ```

3. **Access the app:**
   - Open: http://localhost:5000
   - Health check: http://localhost:5000/health

4. **View logs:**
   ```powershell
   docker-compose logs -f
   ```

5. **Stop the app:**
   ```powershell
   docker-compose down
   ```

### Production Deployment (10 minutes)

1. **Generate secrets:**
   ```powershell
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Run twice to get two different secrets.

2. **Create .env.production.local:**
   ```powershell
   copy .env.production .env.production.local
   ```

3. **Edit .env.production.local:**
   - Update `JWT_SECRET` with first generated secret
   - Update `SESSION_SECRET` with second generated secret
   - Update `FRONTEND_URL` to your domain
   - Update `BACKEND_URL` to your domain/api

4. **Build production image:**
   ```powershell
   docker build -t leveluped-app:production .
   ```

5. **Run in production mode:**
   ```powershell
   docker-compose --env-file .env.production.local up -d
   ```

6. **Test:**
   - http://localhost:5000
   - http://localhost:5000/health

---

## Deploy to Cloud

### Railway.app (Easiest - 5 minutes)

1. Go to https://railway.app/
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables in dashboard
6. Deploy!
7. Get free URL: `your-app.railway.app`

### DigitalOcean (VPS - 15 minutes)

1. **Create Droplet:**
   - Go to https://www.digitalocean.com/
   - Create Droplet (Ubuntu, $4/month)
   - Note the IP address

2. **SSH into server:**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

4. **Clone repository:**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

5. **Create .env.production.local** with your values

6. **Build and run:**
   ```bash
   docker build -t leveluped-app .
   docker-compose --env-file .env.production.local up -d
   ```

7. **Access:**
   - http://your-server-ip:5000

### Fly.io (Free Tier - 10 minutes)

1. **Install Fly CLI:**
   ```powershell
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Login:**
   ```powershell
   fly auth login
   ```

3. **Launch:**
   ```powershell
   fly launch
   ```

4. **Set secrets:**
   ```powershell
   fly secrets set JWT_SECRET=your_secret
   fly secrets set SESSION_SECRET=your_secret
   fly secrets set MONGO_URI=your_mongo_uri
   ```

5. **Deploy:**
   ```powershell
   fly deploy
   ```

---

## Useful Commands

### Container Management
```powershell
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Restart containers
docker-compose restart

# View logs
docker-compose logs -f

# View running containers
docker ps

# Execute command in container
docker exec -it <container-id> sh
```

### Image Management
```powershell
# List images
docker images

# Remove image
docker rmi leveluped-app

# Remove unused images
docker image prune -a

# Build without cache
docker build --no-cache -t leveluped-app .
```

### Debugging
```powershell
# Check container health
docker ps

# View container logs
docker logs <container-id>

# Inspect container
docker inspect <container-id>

# Check resource usage
docker stats
```

---

## Troubleshooting

### Build fails
```powershell
# Clean build
docker build --no-cache -t leveluped-app .

# Check Docker is running
docker ps
```

### Container won't start
```powershell
# Check logs
docker-compose logs

# Check environment variables
docker exec <container-id> env
```

### Can't access app
```powershell
# Check if container is running
docker ps

# Check health endpoint
curl http://localhost:5000/health

# Check port is not in use
netstat -ano | findstr :5000
```

### Database connection fails
- Check MONGO_URI in .env file
- Whitelist server IP in MongoDB Atlas
- Or allow all IPs: 0.0.0.0/0

---

## What's Included

The Docker setup includes:
- ✅ Frontend (React + Vite) - Built and optimized
- ✅ Backend (Node.js + Express) - Production ready
- ✅ Socket.IO - Real-time features
- ✅ Health checks - Auto-restart on failure
- ✅ Environment variables - Secure configuration
- ✅ Multi-stage build - Optimized image size

---

## Next Steps

1. ✅ Test locally with Docker
2. ✅ Choose deployment platform
3. ✅ Deploy to production
4. ✅ Set up domain name (optional)
5. ✅ Configure SSL/HTTPS (recommended)
6. ✅ Set up OAuth (optional)

---

## Support

For detailed instructions, see:
- **DOCKER_DEPLOYMENT.md** - Complete deployment guide
- **DOCKER_COMPOSE.yml** - Container configuration
- **Dockerfile** - Image build instructions

---

**Time to deploy: 5-15 minutes**
**Cost: Free to $4/month**

Your app is ready to deploy! 🚀
