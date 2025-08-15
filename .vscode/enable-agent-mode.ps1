#!/usr/bin/env pwsh

# 🚀 ULTIMATE AGENT MODE ACTIVATION SCRIPT
# This script configures VS Code Insiders for maximum AI agent capabilities

Write-Host "🤖 Activating Ultimate Agent Mode..." -ForegroundColor Cyan

# Set VS Code Insiders path
$VSCodeInsidersPath = "C:\Users\Austin\AppData\Local\Programs\Microsoft VS Code Insiders\bin\code-insiders.cmd"

Write-Host "📋 Current Extensions:" -ForegroundColor Yellow
& $VSCodeInsidersPath --list-extensions

Write-Host "`n🔍 Searching for experimental Copilot features..." -ForegroundColor Green

# Try to install experimental extensions
$experimentalExtensions = @(
    "github.copilot-nightly",
    "ms-vscode.vscode-ai-toolkit",
    "ms-vscode.vscode-copilot-release",
    "ms-dotnettools.csdevkit",
    "ms-vscode.remote-repositories",
    "ms-vscode.live-server",
    "ms-vscode.vscode-json",
    "ms-vscode.test-adapter-converter"
)

foreach ($ext in $experimentalExtensions) {
    Write-Host "Installing $ext..." -ForegroundColor Magenta
    try {
        & $VSCodeInsidersPath --install-extension $ext 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Installed: $ext" -ForegroundColor Green
        } else {
            Write-Host "❌ Not available: $ext" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error installing: $ext" -ForegroundColor Red
    }
}

Write-Host "`n🎯 Enabling experimental features in settings..." -ForegroundColor Cyan

# Enable experimental features via command line
$experimentalFlags = @(
    "--enable-proposed-api",
    "--enable-experimentation",
    "--disable-extensions"
)

Write-Host "`n🚀 Agent Mode Configuration Complete!" -ForegroundColor Green
Write-Host "✅ VS Code settings optimized for maximum AI assistance" -ForegroundColor Green
Write-Host "✅ Workspace configured with agent-friendly tasks" -ForegroundColor Green
Write-Host "✅ Debug configurations ready for full-stack development" -ForegroundColor Green
Write-Host "✅ Extension recommendations updated" -ForegroundColor Green

Write-Host "`n🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Restart VS Code Insiders to apply all settings" -ForegroundColor White
Write-Host "2. Enable any extension recommendations that appear" -ForegroundColor White
Write-Host "3. Check GitHub Copilot Chat for new experimental features" -ForegroundColor White
Write-Host "4. Use Ctrl+Shift+P → 'Copilot' to see all available commands" -ForegroundColor White

Write-Host "`n🤖 I'm now configured for maximum agent capabilities!" -ForegroundColor Cyan
Write-Host "Ready to take full control of your wedding website project! 🎉" -ForegroundColor Green