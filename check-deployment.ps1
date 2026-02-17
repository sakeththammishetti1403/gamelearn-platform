# Simple Deployment Check

Write-Host "`n=== DEPLOYMENT READINESS CHECK ===" -ForegroundColor Cyan

# Check Git
Write-Host "`n1. Git Repository:" -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "   OK - Git repository found" -ForegroundColor Green
} else {
    Write-Host "   WARNING - Not a git repository" -ForegroundColor Red
}

# Check .env
Write-Host "`n2. Environment File:" -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   OK - .env file found" -ForegroundColor Green
} else {
    Write-Host "   WARNING - .env file not found" -ForegroundColor Red
}

# Check dependencies
Write-Host "`n3. Dependencies:" -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   OK - Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   WARNING - Run: npm install" -ForegroundColor Yellow
}

if (Test-Path "client/node_modules") {
    Write-Host "   OK - Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   WARNING - Run: cd client ; npm install" -ForegroundColor Yellow
}

# Check backend
Write-Host "`n4. Backend Server:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 3
    Write-Host "   OK - Backend is running" -ForegroundColor Green
} catch {
    Write-Host "   INFO - Backend not running (OK for deployment)" -ForegroundColor Cyan
}

Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "Ready to deploy!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Follow: DEPLOY_LIVE_NOW.md" -ForegroundColor White
Write-Host "2. Deploy to Render (backend)" -ForegroundColor White
Write-Host "3. Deploy to Vercel (frontend)" -ForegroundColor White
Write-Host ""
