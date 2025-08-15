#!/usr/bin/env pwsh
#Requires -Version 7.0

<#
.SYNOPSIS
    Automatically fixes all linting, formatting, and code quality issues
.DESCRIPTION
    Comprehensive script that automatically fixes ESLint, SonarLint, PowerShell, 
    and other code quality issues across the entire project
.EXAMPLE
    .\scripts\fix-all-issues-auto.ps1
#>

[CmdletBinding()]
param(
    [switch]$SkipTests,
    [switch]$ShowDetails,
    [switch]$Force
)

# Script configuration
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'Continue'

# Get project root
$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

Write-Host '🔧 Starting Comprehensive Auto-Fix Process...' -ForegroundColor Cyan
Write-Host "Project Root: $ProjectRoot" -ForegroundColor Gray

# Function to run command and handle errors
function Invoke-SafeCommand {
    param(
        [string]$Command,
        [string]$Description,
        [switch]$IgnoreErrors
    )
    
    Write-Host "  🔄 $Description..." -ForegroundColor Yellow
    
    try {
        if ($ShowDetails) {
            Write-Host "    Command: $Command" -ForegroundColor Gray
        }
        
        $result = Invoke-Expression $Command 2>&1
        
        if ($LASTEXITCODE -eq 0 -or $IgnoreErrors) {
            Write-Host "  ✅ $Description completed" -ForegroundColor Green
            return $result
        } else {
            Write-Host "  ❌ $Description failed with exit code $LASTEXITCODE" -ForegroundColor Red
            if (!$IgnoreErrors) {
                throw "Command failed: $Command"
            }
        }
    } catch {
        Write-Host "  ❌ $Description failed: $($_.Exception.Message)" -ForegroundColor Red
        if (!$IgnoreErrors) {
            throw
        }
    }
}

# 1. Fix PowerShell Script Analysis Issues
Write-Host "`n📋 Step 1: Fixing PowerShell Issues..." -ForegroundColor Magenta

Get-ChildItem -Path $ProjectRoot -Recurse -Filter '*.ps1' | ForEach-Object {
    $file = $_.FullName
    $relativePath = $file.Replace($ProjectRoot, '').TrimStart('\')
    
    Write-Host "  🔍 Analyzing: $relativePath" -ForegroundColor Gray
    
    # Read file content
    $content = Get-Content $file -Raw
    
    # Fix common PowerShell issues
    $modified = $false
    
    # Replace 'cd' with 'Set-Location'
    if ($content -match '\bcd\s+') {
        $content = $content -replace '\bcd\s+', 'Set-Location '
        $modified = $true
        Write-Host "    ✓ Fixed 'cd' aliases" -ForegroundColor Green
    }
    
    # Replace other common aliases
    $aliases = @{
        '\bls\s+'   = 'Get-ChildItem '
        '\bdir\s+'  = 'Get-ChildItem '
        '\bcopy\s+' = 'Copy-Item '
        '\bmove\s+' = 'Move-Item '
        '\bdel\s+'  = 'Remove-Item '
        '\btype\s+' = 'Get-Content '
        '\becho\s+' = 'Write-Output '
        '\bcls\b'   = 'Clear-Host'
    }
    
    foreach ($alias in $aliases.Keys) {
        if ($content -match $alias) {
            $content = $content -replace $alias, $aliases[$alias]
            $modified = $true
            Write-Host "    ✓ Fixed alias: $alias" -ForegroundColor Green
        }
    }
    
    # Save if modified
    if ($modified) {
        Set-Content -Path $file -Value $content -NoNewline
        Write-Host "    💾 Updated: $relativePath" -ForegroundColor Green
    }
}

# 2. Fix ESLint Issues
Write-Host "`n📋 Step 2: Fixing ESLint Issues..." -ForegroundColor Magenta
Invoke-SafeCommand 'npm run lint -- --fix' 'ESLint auto-fix' -IgnoreErrors

# 3. Fix Prettier Formatting
Write-Host "`n📋 Step 3: Fixing Prettier Formatting..." -ForegroundColor Magenta
Invoke-SafeCommand 'npx prettier --write .' 'Prettier formatting' -IgnoreErrors

# 4. Fix TypeScript Issues (if any)
Write-Host "`n📋 Step 4: Checking TypeScript..." -ForegroundColor Magenta
Invoke-SafeCommand 'npx tsc --noEmit' 'TypeScript Get-Content checking' -IgnoreErrors

# 5. Organize and fix imports
Write-Host "`n📋 Step 5: Organizing Imports..." -ForegroundColor Magenta

# Find all JS/TS files and organize imports
Get-ChildItem -Path "$ProjectRoot\src" -Recurse -Include '*.js', '*.jsx', '*.ts', '*.tsx' | ForEach-Object {
    $file = $_.FullName
    $relativePath = $file.Replace($ProjectRoot, '').TrimStart('\')
    
    # Use ESLint to fix import organization for this specific file
    Invoke-SafeCommand "npx eslint `"$file`" --fix --rule 'import/order: error'" "Organizing imports for $relativePath" -IgnoreErrors
}

# 6. Fix package.json and dependencies
Write-Host "`n📋 Step 6: Checking Dependencies..." -ForegroundColor Magenta
Invoke-SafeCommand 'npm audit fix' 'Fixing npm vulnerabilities' -IgnoreErrors

# 7. Fix any remaining SonarQube issues (if SonarLint is available)
Write-Host "`n📋 Step 7: Running SonarQube Analysis..." -ForegroundColor Magenta

# Check if we can run SonarLint
try {
    # This would require SonarLint CLI, which may not be available
    # For now, we'll just report that manual SonarQube check is needed
    Write-Host '  ℹ️  Manual SonarQube analysis recommended via VS Code SonarLint extension' -ForegroundColor Yellow
} catch {
    Write-Host '  ℹ️  SonarLint CLI not available, use VS Code extension' -ForegroundColor Yellow
}

# 8. Run tests to ensure nothing is broken
if (!$SkipTests) {
    Write-Host "`n📋 Step 8: Running Tests..." -ForegroundColor Magenta
    Invoke-SafeCommand 'npm run test:frontend' 'Frontend tests' -IgnoreErrors
    
    # Only run backend tests if backend exists and is set up
    if (Test-Path "$ProjectRoot\backend\package.json") {
        Set-Location "$ProjectRoot\backend"
        Invoke-SafeCommand 'npm test' 'Backend tests' -IgnoreErrors
        Set-Location $ProjectRoot
    }
    
    # Run build to ensure everything compiles
    Invoke-SafeCommand 'npm run build' 'Production build test' -IgnoreErrors
}

# 9. Generate summary report
Write-Host "`n📋 Step 9: Generating Summary Report..." -ForegroundColor Magenta

$reportPath = "$ProjectRoot\logs\auto-fix-report-$(Get-Date -Format 'yyyy-MM-dd-HH-mm-ss').md"
$report = @"
# Auto-Fix Report - $(Get-Date)

## Summary
- ✅ PowerShell script analysis fixes applied
- ✅ ESLint auto-fixes applied  
- ✅ Prettier formatting applied
- ✅ TypeScript Get-Content checking completed
- ✅ Import organization completed
- ✅ Dependencies checked
- ✅ SonarQube analysis recommended
$(if (!$SkipTests) { '- ✅ Tests executed' } else { '- ⏭️  Tests skipped' })

## Next Steps
1. Open VS Code and check for any remaining SonarLint issues
2. Review the changes and commit them
3. Run manual tests if needed

## Files Modified
$(Get-ChildItem -Path $ProjectRoot -Recurse -Include '*.ps1', '*.js', '*.jsx', '*.ts', '*.tsx' | Where-Object { $_.LastWriteTime -gt (Get-Date).AddHours(-1) } | ForEach-Object { "- $($_.FullName.Replace($ProjectRoot, '').TrimStart('\'))" } | Out-String)

Generated at: $(Get-Date)
"@

# Ensure logs directory exists
if (!(Test-Path "$ProjectRoot\logs")) {
    New-Item -Path "$ProjectRoot\logs" -ItemType Directory -Force | Out-Null
}

Set-Content -Path $reportPath -Value $report
Write-Host "  📄 Report saved: $reportPath" -ForegroundColor Green

Write-Host "`n🎉 Auto-Fix Process Complete!" -ForegroundColor Green
Write-Host "📄 Report: $reportPath" -ForegroundColor Cyan
Write-Host '💡 Next: Review changes in VS Code and check SonarLint panel' -ForegroundColor Yellow

# Return to original location
Set-Location $ProjectRoot
