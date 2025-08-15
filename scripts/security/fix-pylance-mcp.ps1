#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Fix Pylance MCP Server Connection Error - Global Settings Fix

.DESCRIPTION
    This script disables Pylance MCP integration in global VS Code user settings
    to prevent connection attempts to port 5188.

.NOTES
    Run this script to permanently fix the Pylance MCP connection error.
#>

param(
    [switch]$ShowDetails = $false
)

$ErrorActionPreference = 'Stop'

Write-Host '🔧 Fixing Pylance MCP Server Connection Error...' -ForegroundColor Cyan
Write-Host ''

# Path to global VS Code user settings
$globalSettingsPath = "$env:APPDATA\Code\User\settings.json"

if (-not (Test-Path $globalSettingsPath)) {
    Write-Host "❌ Global VS Code settings file not found at: $globalSettingsPath" -ForegroundColor Red
    Write-Host "   This means VS Code hasn't been configured yet. The fix may not be needed." -ForegroundColor Yellow
    exit 0
}

Write-Host "📁 Found global VS Code settings: $globalSettingsPath" -ForegroundColor Green

# Backup the original settings
$backupPath = "$globalSettingsPath.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item $globalSettingsPath $backupPath
Write-Host "💾 Backup created: $backupPath" -ForegroundColor Green

# Read current settings
try {
    $settingsContent = Get-Content $globalSettingsPath -Raw
    $settings = $settingsContent | ConvertFrom-Json
    
    if ($ShowDetails) {
        Write-Host '📋 Current settings analysis:' -ForegroundColor Yellow
        
        # Check for MCP-related settings
        $mcpSettings = @()
        foreach ($key in $settings.PSObject.Properties.Name) {
            if ($key -match 'mcp|pylance.*mcp|python.*mcp') {
                $mcpSettings += "$key = $($settings.$key)"
            }
        }
        
        if ($mcpSettings.Count -gt 0) {
            Write-Host '   Found MCP-related settings:' -ForegroundColor Yellow
            foreach ($setting in $mcpSettings) {
                Write-Host "   - $setting" -ForegroundColor Yellow
            }
        } else {
            Write-Host '   No obvious MCP settings found' -ForegroundColor Green
        }
    }
    
} catch {
    Write-Host "❌ Error reading settings file: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host '   The file might be corrupted or not valid JSON.' -ForegroundColor Yellow
    exit 1
}

# Apply fixes
Write-Host ''
Write-Host '🔨 Applying fixes...' -ForegroundColor Cyan

$changesMade = $false

# Remove Pylance MCP server sampling configuration
if ($settings.PSObject.Properties.Name -contains 'chat.mcp.serverSampling') {
    if ($settings.'chat.mcp.serverSampling'.PSObject.Properties.Name -contains 'pylance mcp server: pylance mcp server') {
        $settings.'chat.mcp.serverSampling'.PSObject.Properties.Remove('pylance mcp server: pylance mcp server')
        Write-Host '   ✅ Removed Pylance MCP server sampling configuration' -ForegroundColor Green
        $changesMade = $true
        
        # If no other MCP servers, remove the entire serverSampling object
        if ($settings.'chat.mcp.serverSampling'.PSObject.Properties.Count -eq 0) {
            $settings.PSObject.Properties.Remove('chat.mcp.serverSampling')
            Write-Host '   ✅ Removed empty chat.mcp.serverSampling object' -ForegroundColor Green
        }
    }
}

# Add explicit Pylance MCP disabling settings
$pylanceSettings = @{
    'python.analysis.enableModelContextProtocol' = $false
    'python.experimental.mcp.enabled'            = $false
    'pylance.experimental.mcp.enabled'           = $false
    'pylance.experimental.modelContextProtocol'  = $false
    'chat.experimental.mcp.enabled'              = $false
}

foreach ($key in $pylanceSettings.Keys) {
    if ($settings.PSObject.Properties.Name -notcontains $key -or $settings.$key -ne $pylanceSettings[$key]) {
        $settings | Add-Member -Name $key -Value $pylanceSettings[$key] -MemberType NoteProperty -Force
        Write-Host "   ✅ Set $key = $($pylanceSettings[$key])" -ForegroundColor Green
        $changesMade = $true
    }
}

# Save the updated settings
if ($changesMade) {
    try {
        $updatedContent = $settings | ConvertTo-Json -Depth 10 -Compress:$false
        Set-Content $globalSettingsPath $updatedContent -Encoding UTF8
        Write-Host ''
        Write-Host '✅ Global VS Code settings updated successfully!' -ForegroundColor Green
        
        # Validate the saved file
        $validation = Get-Content $globalSettingsPath | ConvertFrom-Json
        Write-Host '✅ Settings file validation passed' -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Error saving settings: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host '   Restoring backup...' -ForegroundColor Yellow
        Copy-Item $backupPath $globalSettingsPath
        Write-Host '   ✅ Backup restored' -ForegroundColor Green
        exit 1
    }
} else {
    Write-Host 'ℹ️  No changes needed - settings already correct' -ForegroundColor Blue
}

Write-Host ''
Write-Host '🎯 Next Steps:' -ForegroundColor Cyan
Write-Host '   1. Restart VS Code completely (close all windows)' -ForegroundColor White
Write-Host '   2. Reopen your project' -ForegroundColor White
Write-Host '   3. The Pylance MCP connection error should be resolved' -ForegroundColor White
Write-Host ''
Write-Host '🔍 To verify the fix:' -ForegroundColor Cyan
Write-Host '   - Check the VS Code Output panel (View > Output)' -ForegroundColor White
Write-Host "   - Look for 'Pylance' or 'Python' in the dropdown" -ForegroundColor White
Write-Host "   - There should be no more 'port 5188' connection errors" -ForegroundColor White
Write-Host ''
Write-Host '✨ Fix complete!' -ForegroundColor Green
