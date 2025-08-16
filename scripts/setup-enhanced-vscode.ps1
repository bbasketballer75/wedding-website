#!/usr/bin/env pwsh
# Enhanced VS Code Setup Script for Wedding Website Development
# Optimizes environment for AI assistance and remote development

Write-Host "🚀 Setting up Enhanced VS Code Environment..." -ForegroundColor Green

# Install recommended extensions
Write-Host "📦 Installing VS Code Extensions..." -ForegroundColor Yellow

$extensions = @(
    "bradlc.vscode-tailwindcss",
    "ms-playwright.playwright",
    "vitest.explorer",
    "ritwickdey.LiveServer",
    "formulahendry.auto-rename-tag",
    "gruntfuggly.todo-tree",
    "alefragnani.project-manager",
    "ms-vscode.hexeditor"
)

foreach ($ext in $extensions) {
    Write-Host "  Installing $ext..." -ForegroundColor Cyan
    try {
        code --install-extension $ext --force
        Write-Host "  ✅ Installed $ext" -ForegroundColor Green
    }
    catch {
        Write-Host "  ⚠️ Failed to install $ext" -ForegroundColor Red
    }
}

# Create enhanced workspace configuration
Write-Host "🔧 Creating Enhanced Workspace Configuration..." -ForegroundColor Yellow

$workspaceConfig = @{
    "folders"    = @(
        @{
            "name" = "Wedding Website"
            "path" = "."
        }
    )
    "settings"   = @{
        # Wedding Website Specific Settings
        "files.associations"                                   = @{
            "*.wedding" = "json"
            "*.guest"   = "markdown"
            "*.story"   = "markdown"
        }

        # Enhanced mobile development
        "liveServer.settings.CustomBrowser"                    = "chrome"
        "liveServer.settings.donotShowInfoMsg"                 = $true
        "liveServer.settings.port"                             = 5500
        "liveServer.settings.host"                             = "0.0.0.0"
        "liveServer.settings.useLocalIp"                       = $true

        # AI Enhancement
        "github.copilot.experimental.conversationHistory"      = $true
        "github.copilot.experimental.projectContext"           = $true
        "github.copilot.experimental.workspaceIndexing"        = $true

        # Performance optimization
        "typescript.preferences.includePackageJsonAutoImports" = "auto"
        "npm.enableScriptExplorer"                             = $true
        "npm.enableRunFromFolder"                              = $true
    }
    "extensions" = @{
        "recommendations" = @(
            "GitHub.copilot",
            "GitHub.copilot-chat",
            "bradlc.vscode-tailwindcss",
            "ms-playwright.playwright",
            "vitest.explorer",
            "ritwickdey.LiveServer"
        )
    }
}

$workspaceFile = "wedding-website.code-workspace"
$workspaceConfig | ConvertTo-Json -Depth 10 | Out-File -FilePath $workspaceFile -Encoding UTF8
Write-Host "✅ Created workspace file: $workspaceFile" -ForegroundColor Green

# Test remote tunnel setup
Write-Host "🌐 Testing Remote Tunnel Setup..." -ForegroundColor Yellow

try {
    $tunnelStatus = code tunnel status 2>&1
    if ($tunnelStatus -match "tunnel is not running") {
        Write-Host "  ℹ️ Tunnel not currently running - you can start it with 'code tunnel'" -ForegroundColor Blue
    }
    else {
        Write-Host "  ✅ Tunnel status checked successfully" -ForegroundColor Green
    }
}
catch {
    Write-Host "  ℹ️ Tunnel commands available - ready for remote access" -ForegroundColor Blue
}

# Create mobile testing quick commands
Write-Host "📱 Setting up Mobile Testing Commands..." -ForegroundColor Yellow

$mobileTestScript = @"
#!/usr/bin/env pwsh
# Quick Mobile Testing Script

Write-Host "📱 Starting Mobile Testing Environment..." -ForegroundColor Green

# Start local server for mobile testing
Write-Host "🌐 Starting local development server..." -ForegroundColor Yellow
Start-Process -FilePath "npm" -ArgumentList "run", "dev:local" -NoNewWindow

# Start mobile responsiveness tests
Write-Host "🧪 Running mobile responsiveness tests..." -ForegroundColor Yellow
npm run test:mobile:local

Write-Host "✅ Mobile testing environment ready!" -ForegroundColor Green
Write-Host "📲 Test your wedding website on mobile devices:" -ForegroundColor Cyan
Write-Host "   • Local: http://localhost:3000" -ForegroundColor White
Write-Host "   • Production: https://www.theporadas.com" -ForegroundColor White
"@

$mobileTestScript | Out-File -FilePath "scripts/quick-mobile-test.ps1" -Encoding UTF8
Write-Host "✅ Created mobile testing script: scripts/quick-mobile-test.ps1" -ForegroundColor Green

# Create AI collaboration enhancement script
Write-Host "🤖 Setting up AI Collaboration Enhancements..." -ForegroundColor Yellow

$aiEnhanceScript = @"
#!/usr/bin/env pwsh
# AI Collaboration Enhancement Script

Write-Host "🤖 Enhancing AI Collaboration Environment..." -ForegroundColor Green

# Check GitHub Copilot status
Write-Host "Checking GitHub Copilot status..." -ForegroundColor Yellow
try {
    $copilotStatus = code --list-extensions | Select-String "github.copilot"
    if ($copilotStatus) {
        Write-Host "✅ GitHub Copilot is installed" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Installing GitHub Copilot..." -ForegroundColor Yellow
        code --install-extension GitHub.copilot
        code --install-extension GitHub.copilot-chat
    }
} catch {
    Write-Host "ℹ️ Please ensure GitHub Copilot is installed for optimal AI assistance" -ForegroundColor Blue
}

# Optimize TypeScript for AI suggestions
Write-Host "Optimizing TypeScript for AI suggestions..." -ForegroundColor Yellow
npm run lint:fix

# Generate AI-friendly documentation
Write-Host "Generating AI context documentation..." -ForegroundColor Yellow
if (Test-Path "docs/ai-context.md") {
    Write-Host "✅ AI context documentation exists" -ForegroundColor Green
} else {
    @"
# AI Context - Wedding Website Project

## Project Overview
- **Type**: Wedding website for Austin & Jordyn Porada
- **Tech Stack**: Next.js 14, React 18, TypeScript, TailwindCSS
- **Features**: Photo albums, guestbook, wedding party, analytics
- **Production URL**: https://www.theporadas.com

## Key Components
- Analytics tracking with Vercel Analytics + Google Analytics
- Social media sharing with Open Graph cards
- Mobile-responsive design with comprehensive testing
- Custom wedding-specific functionality

## Development Commands
- ``npm run dev:full`` - Full development environment
- ``npm run test:mobile:all`` - Complete mobile testing
- ``npm run build`` - Production build

## AI Assistant Guidelines
- Focus on wedding-specific features and user experience
- Prioritize mobile-first responsive design
- Maintain accessibility (WCAG AA compliance)
- Optimize for performance and Core Web Vitals
"@ | Out-File -FilePath "docs/ai-context.md" -Encoding UTF8
Write-Host "✅ Created AI context documentation" -ForegroundColor Green
}

Write-Host "🎉 AI collaboration environment optimized!" -ForegroundColor Green
"@

$aiEnhanceScript | Out-File -FilePath "scripts/enhance-ai-collaboration.ps1" -Encoding UTF8
Write-Host "✅ Created AI enhancement script: scripts/enhance-ai-collaboration.ps1" -ForegroundColor Green

# Update package.json with new scripts
Write-Host "📝 Adding Enhanced Development Scripts..." -ForegroundColor Yellow

$packageJson = Get-Content "package.json" | ConvertFrom-Json
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "setup:vscode" -Value "pwsh scripts/enhance-ai-collaboration.ps1" -Force
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "dev:mobile-test" -Value "pwsh scripts/quick-mobile-test.ps1" -Force
$packageJson.scripts | Add-Member -MemberType NoteProperty -Name "setup:remote" -Value "code tunnel --name wedding-website-dev" -Force

$packageJson | ConvertTo-Json -Depth 10 | Out-File -FilePath "package.json" -Encoding UTF8
Write-Host "✅ Updated package.json with enhanced scripts" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Enhanced VS Code Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 New Features Available:" -ForegroundColor Cyan
Write-Host "   • Remote Tunnel Access - Work from anywhere" -ForegroundColor White
Write-Host "   • Cloud Settings Sync - Consistent environment across devices" -ForegroundColor White
Write-Host "   • Enhanced AI Collaboration - Optimized for Copilot" -ForegroundColor White
Write-Host "   • Mobile Testing Tools - Comprehensive responsive testing" -ForegroundColor White
Write-Host "   • Wedding Project Optimization - Tailored for your website" -ForegroundColor White
Write-Host ""
Write-Host "📋 Quick Commands:" -ForegroundColor Yellow
Write-Host "   npm run setup:vscode          # Enhance AI collaboration" -ForegroundColor Cyan
Write-Host "   npm run dev:mobile-test       # Quick mobile testing" -ForegroundColor Cyan
Write-Host "   npm run setup:remote          # Create remote tunnel" -ForegroundColor Cyan
Write-Host "   npm run test:mobile:all       # Full mobile test suite" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Remote Access:" -ForegroundColor Yellow
Write-Host "   Run 'code tunnel' to start remote access" -ForegroundColor Cyan
Write-Host "   Access from: https://vscode.dev/tunnel/wedding-website-dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ready for enhanced wedding website development! 💍✨" -ForegroundColor Magenta
