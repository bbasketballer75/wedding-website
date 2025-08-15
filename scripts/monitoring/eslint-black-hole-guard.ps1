#!/usr/bin/env pwsh
<#
.SYNOPSIS
    ESLint Black Hole Prevention - PowerShell Monitor

.DESCRIPTION
    This script monitors for and prevents the automatic recreation of legacy
    ESLint configuration files that cause endless configuration conflicts.

    Runs continuously in the background to guard against the "black hole" effect.

.PARAMETER Mode
    Operation mode: 'guard' (default), 'check', or 'clean'

.EXAMPLE
    .\eslint-black-hole-guard.ps1 -Mode guard
    .\eslint-black-hole-guard.ps1 -Mode check
#>

param(
    [ValidateSet('guard', 'check', 'clean')]
    [string]$Mode = 'guard'
)

# Configuration
$LegacyConfigFiles = @(
    '.eslintrc.json',
    '.eslintrc.js',
    '.eslintrc.yml',
    '.eslintrc.yaml',
    '.eslintrc'
)

$FlatConfigFile = 'eslint.config.mjs'
$ProjectRoot = Get-Location

# Logging function
function Write-GuardLog {
    param(
        [string]$Message,
        [ValidateSet('Info', 'Success', 'Warning', 'Error', 'Detection')]
        [string]$Type = 'Info'
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $colors = @{
        'Info'      = 'Cyan'
        'Success'   = 'Green'
        'Warning'   = 'Yellow'
        'Error'     = 'Red'
        'Detection' = 'Magenta'
    }

    $emoji = @{
        'Info'      = '🛡️'
        'Success'   = '✅'
        'Warning'   = '⚠️'
        'Error'     = '❌'
        'Detection' = '🚨'
    }

    Write-Host "[$timestamp] $($emoji[$Type]) ESLint Guard: " -NoNewline -ForegroundColor Gray
    Write-Host $Message -ForegroundColor $colors[$Type]
}

# Check for legacy config files
function Test-LegacyConfigs {
    $foundFiles = @()

    foreach ($file in $LegacyConfigFiles) {
        $filePath = Join-Path $ProjectRoot $file
        if (Test-Path $filePath) {
            $foundFiles += $file
        }
    }

    return $foundFiles
}

# Remove legacy config file
function Remove-LegacyConfig {
    param([string]$FileName)

    try {
        $filePath = Join-Path $ProjectRoot $FileName
        Remove-Item $filePath -Force -ErrorAction Stop
        Write-GuardLog "Automatically removed legacy config: $FileName" 'Success'
        return $true
    }
    catch {
        Write-GuardLog "Failed to remove $FileName`: $($_.Exception.Message)" 'Error'
        return $false
    }
}

# Validate flat config exists
function Test-FlatConfig {
    $flatConfigPath = Join-Path $ProjectRoot $FlatConfigFile

    if (-not (Test-Path $flatConfigPath)) {
        Write-GuardLog "Flat config file missing: $FlatConfigFile" 'Error'
        return $false
    }

    Write-GuardLog "Flat config file exists: $FlatConfigFile" 'Success'
    return $true
}

# Perform initial cleanup
function Invoke-InitialCleanup {
    Write-GuardLog 'Starting initial cleanup scan...' 'Info'

    $legacyFiles = Test-LegacyConfigs
    $removedCount = 0

    if ($legacyFiles.Count -gt 0) {
        Write-GuardLog "Found $($legacyFiles.Count) legacy config file(s): $($legacyFiles -join ', ')" 'Detection'

        foreach ($file in $legacyFiles) {
            if (Remove-LegacyConfig $file) {
                $removedCount++
            }
        }
    }
    else {
        Write-GuardLog 'No legacy config files found - good!' 'Success'
    }

    Test-FlatConfig | Out-Null
    return $removedCount
}

# Start file system monitoring
function Start-FileSystemMonitoring {
    Write-GuardLog 'Starting file system monitoring for legacy ESLint configs...' 'Info'

    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = $ProjectRoot
    $watcher.Filter = "*"
    $watcher.IncludeSubdirectories = $false
    $watcher.EnableRaisingEvents = $true

    $action = {
        $name = $Event.SourceEventArgs.Name
        $changeType = $Event.SourceEventArgs.ChangeType

        if ($name -in $LegacyConfigFiles) {
            if ($changeType -eq 'Created' -or $changeType -eq 'Changed') {
                Write-GuardLog "🚨 DETECTED: Legacy config file $changeType`: $name" 'Detection'

                # Small delay to ensure file write is complete
                Start-Sleep -Milliseconds 200

                $filePath = Join-Path $ProjectRoot $name
                if (Test-Path $filePath) {
                    Remove-LegacyConfig $name | Out-Null
                }
            }
        }
    }

    Register-ObjectEvent -InputObject $watcher -EventName Created -Action $action | Out-Null
    Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $action | Out-Null

    return $watcher
}

# Main execution
switch ($Mode) {
    'check' {
        Write-Host "`n🚫 ESLint Black Hole Prevention - Check Mode`n" -ForegroundColor Cyan

        $legacyFiles = Test-LegacyConfigs
        $flatConfigExists = Test-FlatConfig

        if ($legacyFiles.Count -eq 0 -and $flatConfigExists) {
            Write-GuardLog 'All checks passed! No black hole detected.' 'Success'
            exit 0
        }
        else {
            Write-GuardLog 'Issues detected! Run with -Mode clean to fix.' 'Warning'
            exit 1
        }
    }

    'clean' {
        Write-Host "`n🚫 ESLint Black Hole Prevention - Clean Mode`n" -ForegroundColor Cyan
        $removedCount = Invoke-InitialCleanup
        Write-GuardLog "Cleanup completed. Removed $removedCount legacy config file(s)." 'Info'
    }

    'guard' {
        Write-Host "`n🚫 ESLint Black Hole Prevention - Guard Mode`n" -ForegroundColor Cyan

        $removedCount = Invoke-InitialCleanup

        if ($removedCount -gt 0) {
            Write-GuardLog "Initial cleanup removed $removedCount file(s). Starting monitoring..." 'Warning'
        }

        $watcher = Start-FileSystemMonitoring

        Write-GuardLog 'Monitoring active. Press Ctrl+C to stop.' 'Info'
        Write-GuardLog 'The black hole has been sealed! 🔒' 'Success'

        try {
            while ($true) {
                Start-Sleep -Seconds 1
            }
        }
        finally {
            $watcher.EnableRaisingEvents = $false
            $watcher.Dispose()
            Write-GuardLog 'Monitoring stopped.' 'Info'
        }
    }
}
