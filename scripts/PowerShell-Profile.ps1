# PowerShell Profile for Wedding Website Development
# This profile sets up automatic alias corrections and development helpers

# Set strict mode for better error handling
Set-StrictMode -Version Latest

# Custom functions to prevent common alias issues
function Set-LocationSafe {
    param([string]$Path)
    Set-Location $Path
}

# Override common aliases with full cmdlet names to avoid linting issues
if (Get-Alias Set-Location -ErrorAction SilentlyContinue) {
    Remove-Alias Set-Location -Force
}

# Create proper functions instead of aliases
function Set-Location { Set-Location @args }
function Get-ChildItem { Get-ChildItem @args }
function Get-ChildItem { Get-ChildItem @args }
function Copy-Item { Copy-Item @args }
function Move-Item { Move-Item @args }
function Remove-Item { Remove-Item @args }
function Get-Content { Get-Content @args }
function Write-Output { Write-Output @args }
function Clear-Host { Clear-Host }

# Development helper functions
function Start-WeddingDev {
    <#
    .SYNOPSIS
    Starts the wedding website development environment
    #>
    $projectRoot = Split-Path $PSScriptRoot -Parent
    Set-Location $projectRoot
    
    Write-Host "🚀 Starting Wedding Website Development Environment..." -ForegroundColor Cyan
    
    # Start the comprehensive auto-fix process first
    & "$projectRoot\scripts\fix-all-issues-auto.ps1" -SkipTests
    
    # Then start the development servers
    & "$projectRoot\scripts\development\start-dev-with-monitor.ps1"
}

function Repair-AllIssues {
    <#
    .SYNOPSIS
    Runs comprehensive auto-fix for all code quality issues
    #>
    $projectRoot = Split-Path $PSScriptRoot -Parent
    & "$projectRoot\scripts\fix-all-issues-auto.ps1" @args
}

function Test-CodeQuality {
    <#
    .SYNOPSIS
    Runs all quality checks without fixing
    #>
    $projectRoot = Split-Path $PSScriptRoot -Parent
    Set-Location $projectRoot
    
    Write-Host "🔍 Running Code Quality Checks..." -ForegroundColor Cyan
    
    # ESLint check
    Write-Host "📋 ESLint..." -ForegroundColor Yellow
    npm run lint
    
    # TypeScript check  
    Write-Host "📋 TypeScript..." -ForegroundColor Yellow
    npx tsc --noEmit
    
    # Tests
    Write-Host "📋 Tests..." -ForegroundColor Yellow
    npm run test:frontend
    
    # Build
    Write-Host "📋 Build..." -ForegroundColor Yellow
    npm run build
    
    Write-Host "✅ Code Quality Check Complete!" -ForegroundColor Green
}

# Set up auto-completion for our custom functions
Register-ArgumentCompleter -CommandName Repair-AllIssues -ParameterName Force -ScriptBlock {
    param($commandName, $parameterName, $wordToComplete, $commandAst, $fakeBoundParameters)
    'true', 'false' | Where-Object { $_ -like "$wordToComplete*" }
}

# Welcome message
Write-Host "🎉 Wedding Website PowerShell Profile Loaded!" -ForegroundColor Green
Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "  Start-WeddingDev  - Start development environment with auto-fix" -ForegroundColor White
Write-Host "  Repair-AllIssues  - Run comprehensive auto-fix" -ForegroundColor White  
Write-Host "  Test-CodeQuality  - Run all quality checks" -ForegroundColor White
Write-Host ""
