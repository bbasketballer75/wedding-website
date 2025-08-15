# Git Performance Optimization Script
# Removes committed build artifacts and optimizes git performance

param(
    [switch]$DryRun,    # Show what would be done without making changes
    [switch]$Force      # Force cleanup without confirmation
)

Write-Host 'Git Performance Optimization Script' -ForegroundColor Cyan
Write-Host '=======================================' -ForegroundColor Cyan

# Check if we're in a git repository
if (-not (Test-Path '.git')) {
    Write-Host 'Error: Not in a git repository!' -ForegroundColor Red
    exit 1
}

# Count current problematic files
Write-Host 'Analyzing repository...' -ForegroundColor Yellow
$problematicFiles = git ls-files | Where-Object { $_ -match 'node_modules/|\.next/|out/|backend/node_modules/|\.vercel/|coverage/' }
$fileCount = ($problematicFiles | Measure-Object).Count

Write-Host "Found $fileCount build artifacts committed to git" -ForegroundColor Yellow

if ($fileCount -eq 0) {
    Write-Host 'No build artifacts found in git. Repository is clean!' -ForegroundColor Green
    exit 0
}

Write-Host 'Problematic directories found:' -ForegroundColor Yellow
$dirs = @()
if ($problematicFiles | Where-Object { $_ -match '^node_modules/' }) { $dirs += 'node_modules/' }
if ($problematicFiles | Where-Object { $_ -match '^\.next/' }) { $dirs += '.next/' }
if ($problematicFiles | Where-Object { $_ -match '^out/' }) { $dirs += 'out/' }
if ($problematicFiles | Where-Object { $_ -match '^backend/node_modules/' }) { $dirs += 'backend/node_modules/' }
if ($problematicFiles | Where-Object { $_ -match '^\.vercel/' }) { $dirs += '.vercel/' }
if ($problematicFiles | Where-Object { $_ -match '^backend/coverage/' }) { $dirs += 'backend/coverage/' }

foreach ($dir in $dirs) {
    $count = ($problematicFiles | Where-Object { $_ -match "^$([regex]::Escape($dir))" } | Measure-Object).Count
    Write-Host "  - $dir ($count files)" -ForegroundColor White
}

if ($DryRun) {
    Write-Host ''
    Write-Host 'DRY RUN - Would remove these files from git:' -ForegroundColor Cyan
    $problematicFiles | Select-Object -First 10 | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
    if ($fileCount -gt 10) {
        Write-Host "  ... and $($fileCount - 10) more files" -ForegroundColor Gray
    }
    Write-Host ''
    Write-Host 'Dry run complete. Use -Force to apply changes.' -ForegroundColor Green
    exit 0
}

if (-not $Force) {
    Write-Host ''
    Write-Host "WARNING: This will remove $fileCount files from git tracking!" -ForegroundColor Yellow
    Write-Host 'This action cannot be undone without git history recovery.' -ForegroundColor Yellow
    $confirm = Read-Host 'Continue? (y/N)'
    if ($confirm -ne 'y' -and $confirm -ne 'Y') {
        Write-Host 'Operation cancelled.' -ForegroundColor Red
        exit 0
    }
}

Write-Host ''
Write-Host 'Starting git cleanup...' -ForegroundColor Cyan

# Create a backup branch
$backupBranch = "backup-before-cleanup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Write-Host "Creating backup branch: $backupBranch" -ForegroundColor Yellow
git branch $backupBranch

# Remove files from git tracking
Write-Host 'Removing build artifacts from git...' -ForegroundColor Yellow

$batchSize = 100
$batches = [math]::Ceiling($fileCount / $batchSize)
$processed = 0

for ($i = 0; $i -lt $batches; $i++) {
    $batch = $problematicFiles | Select-Object -Skip ($i * $batchSize) -First $batchSize
    
    if ($batch.Count -gt 0) {
        Write-Host "Processing batch $($i + 1)/$batches ($($batch.Count) files)..." -ForegroundColor Gray
        
        # Use git rm --cached to remove from index but keep files locally
        $batch | ForEach-Object {
            git rm --cached "$_" --ignore-unmatch 2>$null
            $processed++
            if ($processed % 50 -eq 0) {
                Write-Host "  Processed $processed/$fileCount files..." -ForegroundColor Gray
            }
        }
    }
}

Write-Host "Removed $processed files from git tracking" -ForegroundColor Green

# Update .gitignore to ensure these stay ignored
Write-Host 'Updating .gitignore...' -ForegroundColor Yellow

$gitignoreContent = Get-Content '.gitignore' -ErrorAction SilentlyContinue
$gitignoreEntries = @(
    '',
    '# Build artifacts (auto-added by git-cleanup.ps1)',
    'node_modules/',
    '.next/',
    'out/',
    'backend/node_modules/',
    'backend/coverage/',
    '.vercel/',
    '*.log',
    '.env.local',
    '.env.*.local',
    'connection-monitor.log*'
)

$needsUpdate = $false
foreach ($entry in $gitignoreEntries) {
    if ($entry -and $gitignoreContent -notcontains $entry) {
        $needsUpdate = $true
        break
    }
}

if ($needsUpdate) {
    $gitignoreEntries | Add-Content '.gitignore'
    Write-Host 'Updated .gitignore with additional entries' -ForegroundColor Green
} else {
    Write-Host '.gitignore already up to date' -ForegroundColor Green
}

# Configure git for better performance
Write-Host 'Optimizing git configuration...' -ForegroundColor Yellow

# Set git config for better performance
git config core.preloadindex true
git config core.fscache true
git config gc.auto 256

Write-Host 'Git configuration optimized' -ForegroundColor Green

# Stage the .gitignore changes
git add .gitignore 2>$null

Write-Host ''
Write-Host 'Git cleanup completed!' -ForegroundColor Green
Write-Host 'Summary:' -ForegroundColor Cyan
Write-Host "  - Removed $processed build artifacts from git tracking" -ForegroundColor White
Write-Host '  - Files remain on disk (not deleted)' -ForegroundColor White
Write-Host '  - Updated .gitignore to prevent future commits' -ForegroundColor White
Write-Host "  - Created backup branch: $backupBranch" -ForegroundColor White
Write-Host '  - Optimized git configuration' -ForegroundColor White

Write-Host ''
Write-Host 'Next steps:' -ForegroundColor Yellow
Write-Host "1. Commit the cleanup: git commit -m `"chore: remove build artifacts from git tracking`"" -ForegroundColor White
Write-Host '2. Push to remote: git push origin main' -ForegroundColor White  
Write-Host '3. Test git performance (should be much faster)' -ForegroundColor White
Write-Host "4. Delete backup branch when satisfied: git branch -D $backupBranch" -ForegroundColor White

Write-Host ''
Write-Host 'Git performance should now be significantly improved!' -ForegroundColor Green
