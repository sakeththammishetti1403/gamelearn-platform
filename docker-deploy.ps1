# Docker Deployment Script for Windows
# This script helps you deploy the application using Docker

Write-Host "🐳 LevelUpED Docker Deployment Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is installed
Write-Host "Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if Docker Compose is available
try {
    $composeVersion = docker-compose --version
    Write-Host "✅ Docker Compose found: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Select deployment mode:" -ForegroundColor Cyan
Write-Host "1. Local Testing (uses .env)" -ForegroundColor White
Write-Host "2. Production (uses .env.production.local)" -ForegroundColor White
Write-Host "3. Build only (no run)" -ForegroundColor White
Write-Host "4. Stop and remove containers" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🔨 Building Docker image..." -ForegroundColor Yellow
        docker build -t leveluped-app .
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Build successful!" -ForegroundColor Green
            Write-Host ""
            Write-Host "🚀 Starting containers..." -ForegroundColor Yellow
            docker-compose up -d
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Containers started successfully!" -ForegroundColor Green
                Write-Host ""
                Write-Host "📱 Your app is running at: http://localhost:5000" -ForegroundColor Cyan
                Write-Host ""
                Write-Host "Useful commands:" -ForegroundColor Yellow
                Write-Host "  View logs:    docker-compose logs -f" -ForegroundColor White
                Write-Host "  Stop app:     docker-compose down" -ForegroundColor White
                Write-Host "  Restart:      docker-compose restart" -ForegroundColor White
            } else {
                Write-Host "❌ Failed to start containers" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Build failed" -ForegroundColor Red
        }
    }
    
    "2" {
        # Check if .env.production.local exists
        if (-not (Test-Path ".env.production.local")) {
            Write-Host ""
            Write-Host "❌ .env.production.local not found!" -ForegroundColor Red
            Write-Host ""
            Write-Host "Creating .env.production.local from template..." -ForegroundColor Yellow
            Copy-Item ".env.production" ".env.production.local"
            Write-Host "✅ Created .env.production.local" -ForegroundColor Green
            Write-Host ""
            Write-Host "⚠️  IMPORTANT: Edit .env.production.local and update:" -ForegroundColor Yellow
            Write-Host "  - JWT_SECRET (generate with: node -e `"console.log(require('crypto').randomBytes(64).toString('hex'))`")" -ForegroundColor White
            Write-Host "  - SESSION_SECRET (generate another one)" -ForegroundColor White
            Write-Host "  - FRONTEND_URL (your domain)" -ForegroundColor White
            Write-Host "  - BACKEND_URL (your domain/api)" -ForegroundColor White
            Write-Host ""
            $continue = Read-Host "Have you updated .env.production.local? (y/n)"
            if ($continue -ne "y") {
                Write-Host "Please update .env.production.local and run this script again." -ForegroundColor Yellow
                exit 0
            }
        }
        
        Write-Host ""
        Write-Host "🔨 Building production Docker image..." -ForegroundColor Yellow
        docker build -t leveluped-app:production .
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Build successful!" -ForegroundColor Green
            Write-Host ""
            Write-Host "🚀 Starting production containers..." -ForegroundColor Yellow
            docker-compose --env-file .env.production.local up -d
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Production containers started successfully!" -ForegroundColor Green
                Write-Host ""
                Write-Host "📱 Your app is running at: http://localhost:5000" -ForegroundColor Cyan
                Write-Host ""
                Write-Host "Next steps:" -ForegroundColor Yellow
                Write-Host "  1. Test the app: http://localhost:5000" -ForegroundColor White
                Write-Host "  2. Check health: http://localhost:5000/health" -ForegroundColor White
                Write-Host "  3. Deploy to your server (see DOCKER_DEPLOYMENT.md)" -ForegroundColor White
            } else {
                Write-Host "❌ Failed to start containers" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Build failed" -ForegroundColor Red
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "🔨 Building Docker image..." -ForegroundColor Yellow
        docker build -t leveluped-app .
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Build successful!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Image built: leveluped-app" -ForegroundColor Cyan
            Write-Host "To run: docker-compose up -d" -ForegroundColor White
        } else {
            Write-Host "❌ Build failed" -ForegroundColor Red
        }
    }
    
    "4" {
        Write-Host ""
        Write-Host "🛑 Stopping and removing containers..." -ForegroundColor Yellow
        docker-compose down
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Containers stopped and removed" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to stop containers" -ForegroundColor Red
        }
    }
    
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Done! 🎉" -ForegroundColor Green
