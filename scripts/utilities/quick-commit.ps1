#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Quick commit and push script for the wedding website
.DESCRIPTION
    Automatically stages all changes, commits with a meaningful message, and pushes to GitHub
.PARAMETER Message
    Optional commit message. If not provided, will use an auto-generated message
.PARAMETER Force
    Skip confirmation prompts
.EXAMPLE
    .\quick-commit.ps1 -Message "Fix ESLint issues and update dependencies"
    .\quick-commit.ps1 -Force
#>

param(
    [string]$Message = "",
    [switch]$Force
)

# Set location to project root
Set-Location $PSScriptRoot\..

Write-Host "🔍 Checking Git status..." -ForegroundColor Cyan

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Not in a Git repository!" -ForegroundColor Red
    exit 1
}

# Get current status
$status = git status --porcelain
if (-not $status) {
    Write-Host "✅ No changes to commit - repository is clean!" -ForegroundColor Green
    exit 0
}

# Show current changes
Write-Host "`n📋 Current changes:" -ForegroundColor Yellow
git status --short

# Auto-generate commit message if not provided
if (-not $Message) {
    $modifiedFiles = @()
    $newFiles = @()

    foreach ($line in $status) {
        $statusCode = $line.Substring(0, 2)
        $fileName = $line.Substring(3)

        if ($statusCode -match "^M") {
            $modifiedFiles += $fileName
        } elseif ($statusCode -match "^A" -or $statusCode -match "^\?\?") {
            $newFiles += $fileName
        }
    }

    $messageParts = @()
    if ($modifiedFiles.Count -gt 0) {
        $messageParts += "Update $($modifiedFiles.Count) files"
    }
    if ($newFiles.Count -gt 0) {
        $messageParts += "Add $($newFiles.Count) new files"
    }

    $Message = $messageParts -join ", "

    # Add current date for uniqueness
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $Message += " ($timestamp)"
}

Write-Host "`n💬 Commit message: $Message" -ForegroundColor Green

# Confirmation unless forced
if (-not $Force) {
    $confirm = Read-Host "`n❓ Proceed with commit and push? (y/N)"
    if ($confirm -notmatch "^[Yy]") {
        Write-Host "❌ Aborted by user" -ForegroundColor Yellow
        exit 0
    }
}

Write-Host "`n🚀 Starting commit process..." -ForegroundColor Cyan

try {
    # Stage all changes
    Write-Host "📦 Staging all changes..."
    git add -A

    # Commit with message
    Write-Host "💾 Committing changes..."
    git commit -m $Message

    # Push to GitHub
    Write-Host "⬆️  Pushing to GitHub..."
    git push origin main

    Write-Host "`n✅ Successfully updated GitHub!" -ForegroundColor Green
    Write-Host "🌐 Your changes are now live at: https://github.com/your-username/wedding-website" -ForegroundColor Cyan

} catch {
    Write-Host "`n❌ Error during Git operations:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
