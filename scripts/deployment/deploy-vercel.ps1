#!/usr/bin/env pwsh

# Vercel Deployment Script for Wedding Website
# This script handles the complete deployment process

param(
    [switch]$Production,
    [switch]$Preview,
    [switch]$CheckOnly
)

Write-Host '🚀 Wedding Website Vercel Deployment Script' -ForegroundColor Blue
Write-Host '=============================================' -ForegroundColor Blue

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host '❌ Vercel CLI not found. Installing...' -ForegroundColor Red
    npm install -g vercel
}

# Pre-deployment checks
Write-Host "`n📋 Running pre-deployment checks..." -ForegroundColor Yellow

# Check if build works
Write-Host '🔨 Testing build...' -ForegroundColor Cyan
try {
    npm run build | Out-Null
    Write-Host '✅ Build successful' -ForegroundColor Green
} catch {
    Write-Host '❌ Build failed. Please fix errors before deploying.' -ForegroundColor Red
    exit 1
}

# Check environment variables
Write-Host '🔑 Checking environment variables...' -ForegroundColor Cyan
$requiredVars = @(
    'GCP_PROJECT_ID',
    'GCP_CLIENT_EMAIL', 
    'GCP_PRIVATE_KEY',
    'OPENAI_API_KEY',
    'ADMIN_KEY'
)

$envFile = '.env.production'
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    $missingVars = @()
    
    foreach ($var in $requiredVars) {
        if (-not ($envContent | Where-Object { $_ -match "^$var=" })) {
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -gt 0) {
        Write-Host "⚠️  Missing environment variables: $($missingVars -join ', ')" -ForegroundColor Yellow
        Write-Host '   Make sure these are set in Vercel dashboard!' -ForegroundColor Yellow
    } else {
        Write-Host '✅ All required environment variables found' -ForegroundColor Green
    }
} else {
    Write-Host '⚠️  .env.production file not found' -ForegroundColor Yellow
}

if ($CheckOnly) {
    Write-Host "`n✅ Pre-deployment checks completed!" -ForegroundColor Green
    exit 0
}

# Deploy to Vercel
Write-Host "`n🚀 Deploying to Vercel..." -ForegroundColor Blue

if ($Production) {
    Write-Host '📦 Deploying to PRODUCTION...' -ForegroundColor Red
    vercel --prod
} elseif ($Preview) {
    Write-Host '📦 Deploying to PREVIEW...' -ForegroundColor Yellow
    vercel
} else {
    Write-Host '📦 Deploying to PREVIEW (default)...' -ForegroundColor Yellow
    vercel
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 Deployment successful!" -ForegroundColor Green
    Write-Host "`n📋 Post-deployment checklist:" -ForegroundColor Blue
    Write-Host '  1. Test /api/health endpoint' -ForegroundColor White
    Write-Host '  2. Verify environment variables in Vercel dashboard' -ForegroundColor White
    Write-Host '  3. Check function logs for any errors' -ForegroundColor White
    Write-Host '  4. Test AI endpoints' -ForegroundColor White
    Write-Host '  5. Monitor performance metrics' -ForegroundColor White
} else {
    Write-Host "`n❌ Deployment failed!" -ForegroundColor Red
    Write-Host 'Check the error messages above and try again.' -ForegroundColor Red
}
