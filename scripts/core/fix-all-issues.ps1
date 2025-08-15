# Wedding Website - Automated Issue Fixer
# This script automatically detects and fixes common code quality issues

param(
    [switch]$Verbose,
    [switch]$DryRun
)

$ErrorActionPreference = "SilentlyContinue"

Write-Host "🔧 AUTOMATED ISSUE FIXER - Wedding Website" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

$issues = @()
$fixes = @()

# Function to log issues and fixes (using approved PowerShell verbs)
function Write-Issue {
    param($Type, $Description, $Action = "")
    $global:issues += @{Get-Content = $Type; Description = $Description; Action = $Action }
    
    if ($Verbose) {
        Write-Host "⚠️  [$Type] $Description" -ForegroundColor Yellow
        if ($Action) {
            Write-Host "   → $Action" -ForegroundColor Gray
        }
    }
}

function Write-Fix {
    param($Description)
    $global:fixes += $Description
    Write-Host "✅ $Description" -ForegroundColor Green
}

# 1. ESLint Issues
Write-Host "🔍 Checking ESLint issues..." -ForegroundColor Blue

try {
    npm run lint 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Issue "ESLint" "Found linting issues" "Running auto-fix"
        
        if (-not $DryRun) {
            npm run lint:fix
            Write-Fix "ESLint auto-fix applied"
        }
    } else {
        Write-Fix "No ESLint issues found"
    }
} catch {
    Write-Issue "ESLint" "Failed to run ESLint check" "Manual intervention needed"
}

# 2. Test Issues
Write-Host "🧪 Running tests..." -ForegroundColor Blue

try {
    npx vitest run --reporter=basic 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Fix "Frontend tests passing"
    } else {
        Write-Issue "Tests" "Frontend tests failing" "Check test output"
    }
} catch {
    Write-Issue "Tests" "Failed to run frontend tests" "Check test configuration"
}

try {
    Set-Location backend; npm test 2>&1 | Out-Null; Set-Location ..
    if ($LASTEXITCODE -eq 0) {
        Write-Fix "Backend tests passing"
    } else {
        Write-Issue "Tests" "Backend tests failing" "Check test output"
    }
} catch {
    Write-Issue "Tests" "Failed to run backend tests" "Check test configuration"
}

# 3. Build Issues
Write-Host "🏗️  Checking build..." -ForegroundColor Blue

try {
    npm run build 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Fix "Build successful"
    } else {
        Write-Issue "Build" "Build failing" "Check build configuration"
    }
} catch {
    Write-Issue "Build" "Failed to run build" "Check build scripts"
}

# 4. Security Issues
Write-Host "🔒 Checking security..." -ForegroundColor Blue

try {
    npm audit --audit-level moderate 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Fix "No security vulnerabilities found"
    } else {
        Write-Issue "Security" "Security vulnerabilities found" "Run npm audit fix"
        
        if (-not $DryRun) {
            npm audit fix --force
            Write-Fix "Security vulnerabilities fixed"
        }
    }
} catch {
    Write-Issue "Security" "Failed to run security audit" "Check npm configuration"
}

# 5. Accessibility Issues
Write-Host "♿ Checking accessibility..." -ForegroundColor Blue

try {
    if (Test-Path "scripts/accessibility-audit.mjs") {
        node scripts/accessibility-audit.mjs 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Fix "Accessibility audit passed"
        } else {
            Write-Issue "Accessibility" "Accessibility issues found" "Check audit report"
        }
    } else {
        Write-Issue "Accessibility" "Accessibility audit script not found" "Create audit script"
    }
} catch {
    Write-Issue "Accessibility" "Failed to run accessibility audit" "Check audit configuration"
}

# 6. Code Formatting
Write-Host "💅 Checking code formatting..." -ForegroundColor Blue

try {
    npm run format:check 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Fix "Code formatting is correct"
    } else {
        Write-Issue "Formatting" "Code formatting issues found" "Running auto-format"
        
        if (-not $DryRun) {
            npm run format
            Write-Fix "Code formatting applied"
        }
    }
} catch {
    Write-Issue "Formatting" "Failed to check code formatting" "Check prettier configuration"
}

# 7. Environment Issues
Write-Host "🌍 Checking environment..." -ForegroundColor Blue

# Check Node.js version
$nodeVersion = node --version
if ($nodeVersion -match "v(\d+)\.") {
    $majorVersion = [int]$matches[1]
    if ($majorVersion -ge 18) {
        Write-Fix "Node.js version $nodeVersion is compatible"
    } else {
        Write-Issue "Environment" "Node.js version $nodeVersion is outdated" "Upgrade to Node.js 18+"
    }
}

# Check for required files
$requiredFiles = @(
    "package.json",
    "next.config.ts",
    "eslint.config.mjs",
    "tsconfig.json"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Fix "Required file $file exists"
    } else {
        Write-Issue "Environment" "Missing required file: $file" "Create missing file"
    }
}

# Summary
Write-Host ""
Write-Host "📊 SUMMARY" -ForegroundColor Cyan
Write-Host "==========" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Fixes Applied: $($fixes.Count)" -ForegroundColor Green
foreach ($fix in $fixes) {
    Write-Host "   • $fix" -ForegroundColor Gray
}

Write-Host ""
Write-Host "⚠️  Issues Found: $($issues.Count)" -ForegroundColor Yellow
foreach ($issue in $issues) {
    Write-Host "   • [$($issue.Type)] $($issue.Description)" -ForegroundColor Gray
    if ($issue.Action) {
        Write-Host "     → $($issue.Action)" -ForegroundColor DarkGray
    }
}

# Auto-run recommendations
if ($issues.Count -gt 0) {
    Write-Host ""
    Write-Host "🚀 RECOMMENDATIONS" -ForegroundColor Cyan
    Write-Host "==================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "To automatically fix many issues, run:" -ForegroundColor White
    Write-Host "   npm run lint:fix && npm run format" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To run this fixer without dry-run mode:" -ForegroundColor White
    Write-Host "   pwsh -ExecutionPolicy Bypass -File scripts/fix-all-issues.ps1" -ForegroundColor Yellow
}

if ($DryRun) {
    Write-Host ""
    Write-Host "🔍 DRY RUN MODE - No changes were made" -ForegroundColor Magenta
}

# Exit with appropriate code
exit $issues.Count
