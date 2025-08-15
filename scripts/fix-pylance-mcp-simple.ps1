#!/usr/bin/env pwsh

# Fix Pylance MCP Server Connection Error - Global Settings Fix
# This script disables Pylance MCP integration in global VS Code user settings

Write-Host '🔧 Fixing Pylance MCP Server Connection Error...' -ForegroundColor Cyan

# Path to global VS Code user settings
$globalSettingsPath = "$env:APPDATA\Code\User\settings.json"

if (-not (Test-Path $globalSettingsPath)) {
    Write-Host '❌ Global VS Code settings file not found' -ForegroundColor Red
    exit 0
}

Write-Host '📁 Found global VS Code settings' -ForegroundColor Green

# Backup the original settings
$backupPath = "$globalSettingsPath.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item $globalSettingsPath $backupPath
Write-Host "💾 Backup created: $backupPath" -ForegroundColor Green

# Read current settings
$settingsContent = Get-Content $globalSettingsPath -Raw
$settings = $settingsContent | ConvertFrom-Json

# Remove Pylance MCP server sampling configuration
$changesMade = $false

if ($settings.'chat.mcp.serverSampling') {
    if ($settings.'chat.mcp.serverSampling'.'pylance mcp server: pylance mcp server') {
        $settings.'chat.mcp.serverSampling'.PSObject.Properties.Remove('pylance mcp server: pylance mcp server')
        Write-Host '✅ Removed Pylance MCP server sampling configuration' -ForegroundColor Green
        $changesMade = $true
    }
    
    # If no other MCP servers, remove the entire serverSampling object
    if ($settings.'chat.mcp.serverSampling'.PSObject.Properties.Count -eq 0) {
        $settings.PSObject.Properties.Remove('chat.mcp.serverSampling')
        Write-Host '✅ Removed empty chat.mcp.serverSampling object' -ForegroundColor Green
    }
}

# Add explicit Pylance MCP disabling settings
$settings | Add-Member -Name 'python.analysis.enableModelContextProtocol' -Value $false -MemberType NoteProperty -Force
$settings | Add-Member -Name 'python.experimental.mcp.enabled' -Value $false -MemberType NoteProperty -Force
$settings | Add-Member -Name 'pylance.experimental.mcp.enabled' -Value $false -MemberType NoteProperty -Force
$settings | Add-Member -Name 'pylance.experimental.modelContextProtocol' -Value $false -MemberType NoteProperty -Force
$settings | Add-Member -Name 'chat.experimental.mcp.enabled' -Value $false -MemberType NoteProperty -Force

Write-Host '✅ Added Pylance MCP disabling settings' -ForegroundColor Green
$changesMade = $true

# Save the updated settings
if ($changesMade) {
    $updatedContent = $settings | ConvertTo-Json -Depth 10
    Set-Content $globalSettingsPath $updatedContent -Encoding UTF8
    Write-Host '✅ Global VS Code settings updated successfully!' -ForegroundColor Green
}

Write-Host ''
Write-Host '🎯 Next Steps:' -ForegroundColor Cyan
Write-Host '   1. Restart VS Code completely (close all windows)' -ForegroundColor White
Write-Host '   2. Reopen your project' -ForegroundColor White
Write-Host '   3. The Pylance MCP connection error should be resolved' -ForegroundColor White
Write-Host ''
Write-Host '✨ Fix complete!' -ForegroundColor Green
