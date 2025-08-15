param(
    [switch]$DryRun,
    [switch]$Force
)

# Git Performance Optimization Script
Write-Host 'Git Performance Optimization Script' -ForegroundColor Cyan

# Check if we're in a git repository
if (-not (Test-Path '.git')) {
    Write-Host 'Error: Not in a git repository!' -ForegroundColor Red
    exit 1
}

Write-Host 'Analyzing repository...' -ForegroundColor Yellow

# Get list of tracked files that should be in .gitignore
$problematicFiles = git ls-files | Where-Object { 
    $_ -match '\.next/' -or 
    $_ -match 'dist/' -or 
    $_ -match 'node_modules/' -or 
    $_ -match '\.vercel/' -or 
    $_ -match '\.env\.local' -or 
    $_ -match 'coverage/' -or 
    $_ -match 'build/' -or 
    $_ -match 'out/' -or 
    $_ -match '\.cache/' 
}

$fileCount = $problematicFiles.Count

if ($fileCount -eq 0) {
    Write-Host 'No build artifacts found in git. Repository is clean!' -ForegroundColor Green
    exit 0
}

Write-Host 'Problematic directories found:' -ForegroundColor Yellow
$dirs = $problematicFiles | ForEach-Object { Split-Path $_ -Parent } | Sort-Object -Unique | Where-Object { $_ -ne '' }

foreach ($dir in $dirs) {
    $count = ($problematicFiles | Where-Object { $_ -match '^' + [regex]::Escape($dir) } | Measure-Object).Count
    Write-Host "  - ${dir} (${count} files)" -ForegroundColor White
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
    Write-Host "WARNING: This will remove ${fileCount} files from git tracking!" -ForegroundColor Yellow
    $response = Read-Host 'Continue? (y/N)'
    if ($response -ne 'y' -and $response -ne 'Y') {
        Write-Host 'Operation cancelled.' -ForegroundColor Red
        exit 1
    }
}

Write-Host ''
Write-Host 'Starting git cleanup...' -ForegroundColor Cyan

# Create backup branch
$backupBranch = "backup-before-cleanup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Write-Host "Creating backup branch: ${backupBranch}" -ForegroundColor Yellow
git branch $backupBranch

# Remove files from git tracking
Write-Host 'Removing build artifacts from git...' -ForegroundColor Yellow

$batchSize = 100
$batches = [math]::Ceiling($fileCount / $batchSize)

$processed = 0
for ($i = 0; $i -lt $batches; $i++) {
    $start = $i * $batchSize
    $batch = $problematicFiles | Select-Object -Skip $start -First $batchSize
    
    # Convert to space-separated string for git rm
    $fileList = $batch -join ' '
    
    if ($fileList) {
        try {
            git rm --cached $fileList.Split(' ')
            $processed += $batch.Count
            Write-Host "  Processed batch $($i + 1)/$batches (${processed}/${fileCount} files)" -ForegroundColor Gray
        } catch {
            Write-Host "  Warning: Some files in batch $($i + 1) may not exist" -ForegroundColor Yellow
        }
    }
}

Write-Host "Removed ${processed} files from git tracking" -ForegroundColor Green

# Update .gitignore
Write-Host 'Updating .gitignore...' -ForegroundColor Yellow

$gitignoreEntries = @(
    '# Build outputs',
    '.next/',
    'dist/',
    'build/',
    'out/',
    '',
    '# Dependencies', 
    'node_modules/',
    '',
    '# Environment files',
    '.env.local',
    '.env.development.local',
    '.env.test.local', 
    '.env.production.local',
    '',
    '# Vercel',
    '.vercel/',
    '',
    '# Coverage',
    'coverage/',
    '',
    '# Cache',
    '.cache/',
    '.tmp/'
)

$gitignorePath = '.gitignore'
$currentContent = if (Test-Path $gitignorePath) { Get-Content $gitignorePath } else { @() }

$needsUpdate = $false
foreach ($entry in $gitignoreEntries) {
    if ($entry -ne '' -and $entry -notmatch '^#' -and $currentContent -notcontains $entry) {
        $needsUpdate = $true
        break
    }
}

if ($needsUpdate) {
    $gitignoreEntries | Add-Content $gitignorePath
    Write-Host 'Updated .gitignore with additional entries' -ForegroundColor Green
} else {
    Write-Host '.gitignore already up to date' -ForegroundColor Green
}

# Optimize git configuration
Write-Host 'Optimizing git configuration...' -ForegroundColor Yellow
git config core.preloadindex true
git config core.fscache true
git config gc.auto 256
git config pack.threads 0
git config pack.windowMemory 100m
Write-Host 'Git configuration optimized' -ForegroundColor Green

# Create commit
git add .gitignore
git commit -m "Remove build artifacts from git tracking

- Removed ${processed} build artifact files
- Updated .gitignore to prevent future tracking
- Optimized git configuration for better performance

This should significantly improve git performance."

Write-Host ''
Write-Host 'Git cleanup completed!' -ForegroundColor Green
Write-Host 'Summary:' -ForegroundColor Cyan
Write-Host "- Files removed from tracking: ${processed}" -ForegroundColor White
Write-Host "- Backup branch created: ${backupBranch}" -ForegroundColor White
Write-Host '- .gitignore updated' -ForegroundColor White
Write-Host '- Git configuration optimized' -ForegroundColor White

Write-Host ''
Write-Host 'Next steps:' -ForegroundColor Yellow
Write-Host '1. Review the changes: git status' -ForegroundColor White
Write-Host '2. Push to remote: git push origin main' -ForegroundColor White  
Write-Host '3. Test git performance (should be much faster)' -ForegroundColor White
Write-Host "4. Delete backup branch when satisfied: git branch -D ${backupBranch}" -ForegroundColor White

Write-Host ''
Write-Host 'Git performance should now be significantly improved!' -ForegroundColor Green
