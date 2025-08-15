#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Auto-commit development changes at regular intervals
.DESCRIPTION
    Watches for file changes and automatically commits them with timestamps
    Useful for development work where you want continuous backups
.PARAMETER IntervalMinutes
    How often to check for changes (default: 30 minutes)
.PARAMETER AutoPush
    Whether to automatically push to GitHub (default: false for safety)
#>

param(
    [int]$IntervalMinutes = 30,
    [switch]$AutoPush
)

Set-Location $PSScriptRoot\..

Write-Host "🔄 Starting auto-commit watcher..." -ForegroundColor Cyan
Write-Host "⏱️  Checking every $IntervalMinutes minutes" -ForegroundColor Yellow
Write-Host "📤 Auto-push: $(if($AutoPush){'Enabled'}else{'Disabled'})" -ForegroundColor Yellow
Write-Host "⏹️  Press Ctrl+C to stop`n" -ForegroundColor Gray

while ($true) {
    try {
        $status = git status --porcelain

        if ($status) {
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            $changeCount = ($status | Measure-Object).Count

            Write-Host "📝 Found $changeCount changes at $timestamp" -ForegroundColor Green

            # Stage and commit
            git add -A
            git commit -m "Auto-commit: $changeCount changes ($timestamp)"

            Write-Host "✅ Auto-committed changes" -ForegroundColor Green

            # Optional auto-push
            if ($AutoPush) {
                git push origin main
                Write-Host "📤 Pushed to GitHub" -ForegroundColor Cyan
            }
        } else {
            Write-Host "💤 No changes detected at $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray
        }

        # Wait for next interval
        Start-Sleep -Seconds ($IntervalMinutes * 60)

    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        Start-Sleep -Seconds 60  # Wait 1 minute before retrying
    }
}
