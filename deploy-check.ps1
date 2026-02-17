# Deployment Readiness Check Script

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         DEPLOYMENT READINESS CHECK                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

$allGood = $true

# Check 1: Git Repository
Write-Host "1. Checking Git Repository..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "   ✅ Git repository found" -ForegroundColor Green
    
    # Check if there are uncommitted changes
    $status = git status --porcelain
    if ($status) {
        Write-Host "   ⚠️  You have uncommitted changes" -ForegroundColor Yellow
        Write-Host "   Run: git add . ; git commit -m 'Ready for deployment'" -ForegroundColor White
        $allGood = $false
    } else {
        Write-Host "   ✅ No uncommitted changes" -ForegroundColor Green
    }
} else {
    Write-Host "   ❌ Not a git repository" -ForegroundColor Red
    Write-Host "   Run: git init ; git add . ; git commit -m 'Initial commit'" -ForegroundColor White
    $allGood = $false
}

# Check 2: .env file
Write-Host "`n2. Checking .env file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ✅ .env file found" -ForegroundColor Green
    
    $envContent = Get-Content ".env" -Raw
    
    # Check critical variables
    if ($envContent -match "MONGO_URI=mongodb") {
        Write-Host "   ✅ MONGO_URI configured" -ForegroundColor Green
    } else {
        Write-Host "   ❌ MONGO_URI not configured" -ForegroundColor Red
        $allGood = $false
    }
    
    if ($envContent -match "JWT_SECRET=.{20}") {
        Write-Host "   ✅ JWT_SECRET configured" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  JWT_SECRET should be longer/stronger" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ .env file not found" -ForegroundColor Red
    $allGood = $false
}

# Check 3: .gitignore
Write-Host "`n3. Checking .gitignore..." -ForegroundColor Yellow
if (Test-Path ".gitignore") {
    $gitignore = Get-Content ".gitignore" -Raw
    if ($gitignore -match "\.env") {
        Write-Host "   ✅ .env is in .gitignore" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  .env should be in .gitignore" -ForegroundColor Yellow
        Write-Host "   Add '.env' to .gitignore file" -ForegroundColor White
    }
} else {
    Write-Host "   ⚠️  .gitignore not found" -ForegroundColor Yellow
}

# Check 4: Dependencies
Write-Host "`n4. Checking Dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Backend dependencies not installed" -ForegroundColor Yellow
    Write-Host "   Run: npm install" -ForegroundColor White
}

if (Test-Path "client/node_modules") {
    Write-Host "   ✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Frontend dependencies not installed" -ForegroundColor Yellow
    Write-Host "   Run: cd client ; npm install" -ForegroundColor White
}

# Check 5: Build Test
Write-Host "`n5. Testing Frontend Build..." -ForegroundColor Yellow
try {
    Push-Location client
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Frontend builds successfully" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Frontend build failed" -ForegroundColor Red
        Write-Host "   Check the error above" -ForegroundColor White
        $allGood = $false
    }
    Pop-Location
} catch {
    Write-Host "   ❌ Could not test build" -ForegroundColor Red
    Pop-Location
    $allGood = $false
}

# Check 6: Backend Health
Write-Host "`n6. Checking Backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Backend is running and healthy" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Backend is not running" -ForegroundColor Yellow
    Write-Host "   This is OK - it will run on Render" -ForegroundColor White
}

# Summary
Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    SUMMARY                                 ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "✅ ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host "`nYou're ready to deploy!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Push code to GitHub: git push origin main" -ForegroundColor White
    Write-Host "2. Follow: DEPLOY_LIVE_NOW.md" -ForegroundColor White
    Write-Host "3. Deploy backend to Render" -ForegroundColor White
    Write-Host "4. Deploy frontend to Vercel" -ForegroundColor White
} else {
    Write-Host "⚠️  SOME ISSUES FOUND" -ForegroundColor Yellow
    Write-Host "`nFix the issues above before deploying." -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor White
}

Write-Host ""
