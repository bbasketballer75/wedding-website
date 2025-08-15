#!/usr/bin/env pwsh

<#
.SYNOPSIS
Development Environment Setup fWrite-Host "  vercel --version        # Vercel CLI" -ForegroundColor Cyanr Austin's Wedding Website
.DESCRIPTION
Automated setup script for all recommended tools and extensions
#>

Write-Host '🚀 WEDDING WEBSITE - DEVELOPMENT ENVIRONMENT SETUP' -ForegroundColor Green
Write-Host '=================================================' -ForegroundColor Green

Write-Host "`n📦 INSTALLING ESSENTIAL GLOBAL PACKAGES..." -ForegroundColor Yellow

# Essential CLI tools
$packages = @(
    'firebase-tools',           # Firebase CLI for Firestore management
    'lighthouse',              # Performance auditing
    '@storybook/cli',          # Component development
    'vercel',                  # Vercel deployment option
    'npm-check-updates'        # Keep dependencies updated
)

foreach ($package in $packages) {
    Write-Host "Installing $package..." -ForegroundColor Cyan
    try {
        npm install -g $package
        Write-Host "✅ $package installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install $package" -ForegroundColor Red
    }
}

Write-Host "`n☁️ GOOGLE CLOUD SDK INSTALLATION:" -ForegroundColor Yellow
Write-Host 'Google Cloud SDK must be installed separately:' -ForegroundColor White
Write-Host '  1. Download from: https://cloud.google.com/sdk/docs/install-sdk#windows' -ForegroundColor Cyan
Write-Host '  2. Run the installer (GoogleCloudSDKInstaller.exe)' -ForegroundColor Cyan
Write-Host "  3. Follow the setup wizard and authenticate with 'gcloud auth login'" -ForegroundColor Cyan
Write-Host "  4. Set your project: 'gcloud config set project YOUR_PROJECT_ID'" -ForegroundColor Cyan

Write-Host "`n🎯 RECOMMENDED VS CODE EXTENSIONS:" -ForegroundColor Yellow
Write-Host 'Install these manually in VS Code Extensions marketplace:' -ForegroundColor White

$extensions = @{
    'dsznajder.es7-react-js-snippets'  = 'ES7+ React/Redux snippets'
    'PulkitGangwar.nextjs-snippets'    = 'Next.js snippets'
    'deque-systems.vscode-axe-linter'  = 'Accessibility linter'
    'microsoft.accessibility-insights' = 'Accessibility insights'
    'toba.vsfire'                      = 'Firebase Explorer'
    'googlecloudtools.cloudcode'       = 'Google Cloud Code'
    'rangav.vscode-thunder-client'     = 'API testing client'
    'sonarsource.sonarlint-vscode'     = 'Advanced code analysis'
    'usernamehw.errorlens'             = 'Inline error highlighting'
    'formulahendry.auto-rename-tag'    = 'Auto rename HTML tags'
    'ritwickdey.liveserver'            = 'Live development server'
    'ms-vscode.vscode-typescript-next' = 'TypeScript support'
    'bradlc.vscode-tailwindcss'        = 'TailwindCSS IntelliSense'
    'pflannery.vscode-versionlens'     = 'Package version info'
}

foreach ($extension in $extensions.GetEnumerator()) {
    Write-Host "  📋 $($extension.Key) - $($extension.Value)" -ForegroundColor Cyan
}

Write-Host "`n🔧 DEVELOPMENT ENVIRONMENT VALIDATION:" -ForegroundColor Yellow
Write-Host 'Run these commands to verify setup:' -ForegroundColor White
Write-Host '  node --version          # Should be 18+' -ForegroundColor Cyan
Write-Host '  npm --version           # Should be 8+' -ForegroundColor Cyan
Write-Host '  firebase --version      # Firebase CLI' -ForegroundColor Cyan
Write-Host '  vercel --version        # Vercel CLI' -ForegroundColor Cyan
Write-Host '  lighthouse --version    # Lighthouse auditing' -ForegroundColor Cyan

Write-Host "`n🎊 NEXT STEPS:" -ForegroundColor Yellow
Write-Host '1. Install VS Code extensions listed above' -ForegroundColor White
Write-Host "2. Run 'npm run dev' to start development server" -ForegroundColor White
Write-Host "3. Run 'npm test' to ensure all tests pass" -ForegroundColor White
Write-Host "4. Use 'npm run build:analyze' to check bundle size" -ForegroundColor White

Write-Host "`n✅ DEVELOPMENT ENVIRONMENT SETUP COMPLETE!" -ForegroundColor Green
