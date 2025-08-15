# Security Remediation Script
# This script helps secure exposed GCP service account credentials

param(
    [switch]$Execute,  # Actually perform the actions (dry-run by default)
    [switch]$Force     # Skip confirmations
)

Write-Host '🚨 SECURITY REMEDIATION SCRIPT 🚨' -ForegroundColor Red -BackgroundColor Yellow
Write-Host ''

$exposedFiles = @(
    'backend\config\gcp-service-account.json',
    'backend\config\gcs-key.json'
)

Write-Host 'EXPOSED CREDENTIAL FILES DETECTED:' -ForegroundColor Red
foreach ($file in $exposedFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Yellow
    } else {
        Write-Host "  ✗ $file (not found)" -ForegroundColor Green
    }
}

Write-Host ''
Write-Host 'REMEDIATION STEPS:' -ForegroundColor Cyan

Write-Host ''
Write-Host '1. REVOKE SERVICE ACCOUNTS (Manual Action Required):' -ForegroundColor Red
Write-Host '   - Go to Google Cloud Console > IAM & Admin > Service Accounts'
Write-Host '   - Find: wedding-website-backend@wedding-website-final.iam.gserviceaccount.com'
Write-Host '   - Delete or disable the service account'
Write-Host '   - Create a new service account with minimal permissions'

Write-Host ''
Write-Host '2. REMOVE CREDENTIAL FILES:' -ForegroundColor Yellow
if ($Execute) {
    foreach ($file in $exposedFiles) {
        if (Test-Path $file) {
            if ($Force -or (Read-Host "Delete $file? (y/N)") -eq 'y') {
                Remove-Item $file -Force
                Write-Host "   ✓ Deleted: $file" -ForegroundColor Green
            } else {
                Write-Host "   ✗ Skipped: $file" -ForegroundColor Yellow
            }
        }
    }
} else {
    Write-Host '   [DRY RUN] Would delete:' -ForegroundColor Gray
    foreach ($file in $exposedFiles) {
        if (Test-Path $file) {
            Write-Host "     - $file" -ForegroundColor Gray
        }
    }
}

Write-Host ''
Write-Host '3. UPDATE .GITIGNORE:' -ForegroundColor Yellow
$gitignoreEntries = @(
    '# Service account keys',
    'backend/config/*-key.json',
    'backend/config/gcp-service-account.json',
    'backend/config/service-account*.json',
    '*.pem',
    '*.p12'
)

$gitignorePath = '.gitignore'
if (Test-Path $gitignorePath) {
    $currentContent = Get-Content $gitignorePath -Raw
    $needsUpdate = $false
    
    foreach ($entry in $gitignoreEntries) {
        if ($currentContent -notlike "*$entry*") {
            $needsUpdate = $true
            break
        }
    }
    
    if ($needsUpdate) {
        if ($Execute) {
            Write-Host '   ✓ Updating .gitignore...' -ForegroundColor Green
            Add-Content $gitignorePath "`n# Added by security remediation"
            foreach ($entry in $gitignoreEntries) {
                Add-Content $gitignorePath $entry
            }
        } else {
            Write-Host '   [DRY RUN] Would add to .gitignore:' -ForegroundColor Gray
            foreach ($entry in $gitignoreEntries) {
                Write-Host "     $entry" -ForegroundColor Gray
            }
        }
    } else {
        Write-Host '   ✓ .gitignore already contains security patterns' -ForegroundColor Green
    }
}

Write-Host ''
Write-Host '4. ENVIRONMENT VARIABLES SETUP:' -ForegroundColor Yellow
Write-Host '   Add these to your production environment:'
Write-Host '   GCP_PROJECT_ID=your-project-id'
Write-Host '   GCP_CLIENT_EMAIL=new-service-account@your-project.iam.gserviceaccount.com'
Write-Host '   GCP_PRIVATE_KEY=\'-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\""
Write-Host '   GCS_BUCKET_NAME=your-bucket-name'

Write-Host ''
Write-Host '5. GIT HISTORY CLEANUP (Advanced):' -ForegroundColor Red
Write-Host '   WARNING: These commands rewrite Git history!'
Write-Host "   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch backend/config/gcp-service-account.json' --prune-empty --tag-name-filter cat -- --all"
Write-Host "   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch backend/config/gcs-key.json' --prune-empty --tag-name-filter cat -- --all"
Write-Host '   git push origin --force --all'

Write-Host ''
if (-not $Execute) {
    Write-Host 'This was a DRY RUN. Use -Execute to perform actions.' -ForegroundColor Cyan
    Write-Host 'Example: .\scripts\security-remediation.ps1 -Execute' -ForegroundColor Cyan
}

Write-Host ''
Write-Host '🔒 Remember to rotate all credentials and audit access logs!' -ForegroundColor Green
