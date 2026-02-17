# OAuth Setup Verification Script

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "OAuth Setup Verification" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
    
    # Read .env file
    $envContent = Get-Content ".env" -Raw
    
    # Check each OAuth credential
    Write-Host "`nChecking OAuth Credentials:" -ForegroundColor Yellow
    
    # Google
    if ($envContent -match "GOOGLE_CLIENT_ID=([^\r\n]+)") {
        $googleId = $matches[1]
        if ($googleId -notmatch "your_|_here|placeholder|DISABLED") {
            Write-Host "  ✅ Google Client ID: Configured" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Google Client ID: Not configured" -ForegroundColor Yellow
        }
    }
    
    if ($envContent -match "GOOGLE_CLIENT_SECRET=([^\r\n]+)") {
        $googleSecret = $matches[1]
        if ($googleSecret -notmatch "your_|_here|placeholder|DISABLED") {
            Write-Host "  ✅ Google Client Secret: Configured" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Google Client Secret: Not configured" -ForegroundColor Yellow
        }
    }
    
    # GitHub
    if ($envContent -match "GITHUB_CLIENT_ID=([^\r\n]+)") {
        $githubId = $matches[1]
        if ($githubId -notmatch "your_|_here|placeholder|DISABLED") {
            Write-Host "  ✅ GitHub Client ID: Configured" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  GitHub Client ID: Not configured" -ForegroundColor Yellow
        }
    }
    
    if ($envContent -match "GITHUB_CLIENT_SECRET=([^\r\n]+)") {
        $githubSecret = $matches[1]
        if ($githubSecret -notmatch "your_|_here|placeholder|DISABLED") {
            Write-Host "  ✅ GitHub Client Secret: Configured" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  GitHub Client Secret: Not configured" -ForegroundColor Yellow
        }
    }
    
    # LinkedIn
    if ($envContent -match "LINKEDIN_CLIENT_ID=([^\r\n]+)") {
        $linkedinId = $matches[1]
        if ($linkedinId -notmatch "your_|_here|placeholder|DISABLED") {
            Write-Host "  ✅ LinkedIn Client ID: Configured" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  LinkedIn Client ID: Not configured" -ForegroundColor Yellow
        }
    }
    
    if ($envContent -match "LINKEDIN_CLIENT_SECRET=([^\r\n]+)") {
        $linkedinSecret = $matches[1]
        if ($linkedinSecret -notmatch "your_|_here|placeholder|DISABLED") {
            Write-Host "  ✅ LinkedIn Client Secret: Configured" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  LinkedIn Client Secret: Not configured" -ForegroundColor Yellow
        }
    }
    
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
}

# Check OAuth status from API
Write-Host "`nChecking OAuth Status from API:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/oauth-status" -UseBasicParsing
    $status = $response.Content | ConvertFrom-Json
    
    if ($status.google) {
        Write-Host "  ✅ Google OAuth: READY" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Google OAuth: Not configured" -ForegroundColor Yellow
    }
    
    if ($status.github) {
        Write-Host "  ✅ GitHub OAuth: READY" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  GitHub OAuth: Not configured" -ForegroundColor Yellow
    }
    
    if ($status.linkedin) {
        Write-Host "  ✅ LinkedIn OAuth: READY" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  LinkedIn OAuth: Not configured" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "  ❌ Cannot connect to backend server" -ForegroundColor Red
    Write-Host "  Make sure the server is running on port 5000" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Follow: SETUP_OAUTH_STEP_BY_STEP.md" -ForegroundColor White
Write-Host "2. Update .env with your OAuth credentials" -ForegroundColor White
Write-Host "3. Run this script again to verify" -ForegroundColor White
Write-Host "4. OAuth buttons will appear automatically!" -ForegroundColor White
Write-Host ""
