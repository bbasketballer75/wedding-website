# Wedding Website Root Directory Cleanup Script
# Organizes scattered files into proper directory structure

Write-Host "Starting root directory cleanup..." -ForegroundColor Green

# Create necessary directories
$directories = @(
    "docs/status",
    "docs/deployment",
    "docs/configuration",
    "docs/troubleshooting",
    "logs/mcp",
    "config/environment",
    "archives/backups"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "Created directory: $dir" -ForegroundColor Green
    }
}

# Move status/completion markdown files to docs/status/
$statusFiles = @(
    "ADVANCED-FEATURES-IMPLEMENTATION-COMPLETE.md",
    "AGENT-MODE-STATUS.md",
    "ALL-SYSTEMS-OPERATIONAL.md",
    "BUILD-ISSUE-RESOLUTION-SUCCESS.md",
    "CI-CD-FIXES-DEPLOYED.md",
    "CLEANUP-COMPLETE-SUMMARY.md",
    "COMPLETE-SYSTEM-STATUS.md",
    "COMPLETE-SYSTEM-TEST.md",
    "COMPREHENSIVE-CODEBASE-OPTIMIZATION-COMPLETE.md",
    "COMPREHENSIVE-OPTIMIZATION-COMPLETE.md",
    "COMPREHENSIVE-VALIDATION-COMPLETE.md",
    "CONVERSATION-SUMMARY.md",
    "CRITICAL-PRODUCTION-FIXES-COMPLETE.md",
    "CYPRESS-CI-PORT-MISMATCH-FIXED.md",
    "CYPRESS-SPEEDINSIGHTS-UPDATE.md",
    "DEPRECATED-PACKAGE-RESOLUTION.md",
    "EXTENSION-SETTINGS-AUDIT-COMPLETE.md",
    "EXTENSION-SETTINGS-FINAL-OPTIMIZATION.md",
    "EXTENSIONS-COMPREHENSIVE-AUDIT.md",
    "FINAL-EXTENSIONS-OPTIMIZATION-COMPLETE.md",
    "FINAL-PRE-RESTART-OPTIMIZATION.md",
    "FIRESTORE-SETUP-COMPLETE.md",
    "IMPLEMENTATION-COMPLETE.md",
    "IMPLEMENTATION-ROADMAP-COMPLETE.md",
    "INCREDIBLE-UX-ENHANCEMENT-PLAN.md",
    "JEST-VITEST-ISSUE-RESOLVED.md",
    "MAGICAL-UX-DEPLOYMENT-READY.md",
    "MAGICAL-UX-INTEGRATION-COMPLETE.md",
    "MAXIMUM-AGENT-CAPABILITIES-ACHIEVED.md",
    "MCP-INTEGRATION-COMPLETE.md",
    "MCP-OPTIMIZATION-COMPLETE.md",
    "MCP-SERVERS-STATUS-VERIFIED.md",
    "MODERN-2025-TRANSFORMATION-COMPLETE.md",
    "MONGODB-MCP-CLEANUP-COMPLETE.md",
    "NETLIFY-REMOVAL-COMPLETE.md",
    "ORGANIZATION-COMPLETE.md",
    "PERFECT-COMPATIBILITY-ACHIEVED.md",
    "POST-WEDDING-IMPLEMENTATION-COMPLETE.md",
    "POWERSHELL-SYNTAX-FIXED.md",
    "PRODUCTION-DEPLOYMENT-COMPLETE.md",
    "PRODUCTION-DEPLOYMENT-SUCCESS.md",
    "PRODUCTION-CONSOLE-ERRORS-RESOLVED.md",
    "SECURITY-ANALYSIS-UPDATED.md",
    "SETUP-COMPLETE.md",
    "SONARQUBE-FIXES-COMPLETE.md",
    "SONARQUBE-FIXES-SUMMARY.md",
    "SUPERPOWER-IMPLEMENTATION-COMPLETE.md",
    "SUPERPOWERS-ANALYSIS-INSIDERS.md",
    "TECH-STACK-AUDIT.md",
    "TESTING-DECISIONS.md",
    "TRANSITION-TO-INSIDERS.md",
    "ULTIMATE-AGENT-CONTROL-COMPLETE.md",
    "ULTIMATE-VSCODE-SUPERPOWERS-ACTIVATED.md",
    "VERCEL-MIGRATION-COMPLETE.md",
    "VERCEL-OPTIMIZATION-COMPLETE.md",
    "VS-CODE-INSIDERS-INSTALLATION-COMPLETE.md",
    "VSCODE-EXTENSIONS-OPTIMIZATION-COMPLETE.md",
    "VSCODE-INSIDERS-CONFIGURATION-STRATEGY.md",
    "WEDDING-COLOR-THEME-COMPLETE.md",
    "WEDDING-WEBSITE-EXTENSIONS-PERFECTLY-OPTIMIZED.md"
)

Write-Host "Moving status files..." -ForegroundColor Yellow
foreach ($file in $statusFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs/status/" -Force
        Write-Host "  Moved $file" -ForegroundColor Gray
    }
}

# Move deployment-related files to docs/deployment/
$deploymentFiles = @(
    "FINAL-DEPLOYMENT-CHECKLIST.md",
    "FINAL-DEPLOYMENT-STATUS.md",
    "PRODUCTION-DEPLOYMENT-GUIDE.md",
    "VERCEL-DEPLOYMENT-GUIDE.md",
    "VERCEL-DEPLOYMENT-READY.md",
    "VERCEL-DEPLOYMENT-UPDATE.md",
    "production-deployment-report.txt",
    "build-output.txt"
)

Write-Host "Moving deployment files..." -ForegroundColor Yellow
foreach ($file in $deploymentFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs/deployment/" -Force
        Write-Host "  Moved $file" -ForegroundColor Gray
    }
}

# Move troubleshooting guides to docs/troubleshooting/
$troubleshootingFiles = @(
    "DNS-FIX-URGENT.md",
    "DNS-PROPAGATION-STATUS.md",
    "DNS-QUICK-REFERENCE.md",
    "DNS-TROUBLESHOOTING.md",
    "GCS-CREDENTIALS-FIX.md",
    "GMAIL-APP-PASSWORD-TROUBLESHOOTING.md",
    "PYLANCE-MCP-FIX-GUIDE.md"
)

Write-Host "Moving troubleshooting files..." -ForegroundColor Yellow
foreach ($file in $troubleshootingFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs/troubleshooting/" -Force
        Write-Host "  Moved $file" -ForegroundColor Gray
    }
}

# Move setup/configuration guides to docs/configuration/
$configFiles = @(
    "CUSTOM-DOMAIN-EMAIL-SETUP.md",
    "DOMAIN-SETUP-GUIDE.md",
    "GMAIL-SETUP-GUIDE.md",
    "GOOGLE-CLOUD-SETUP-GUIDE.md",
    "MCP-ENHANCEMENT-RECOMMENDATIONS.md",
    "MCP-FILESYSTEM-ACCESS-SETUP.md",
    "MCP-FILESYSTEM-CONFIG.md",
    "MCP-SUPERPOWER-IMPLEMENTATION-PLAN.md",
    "MCP-WEDDING-ENHANCEMENT-PLAN.md",
    "MCP-WEDDING-INTEGRATION.md",
    "PORKBUN-EMAIL-FORWARDING-GUIDE.md",
    "PORKBUN-TXT-RECORDS-GUIDE.md",
    "PORKBUN-VERIFICATION-CHECKLIST.md",
    "POST-WEDDING-MCP-RECOMMENDATIONS.md",
    "POST-WEDDING-SETUP-CHECKLIST.md",
    "SECURITY-SECRETS-MANAGEMENT.md",
    "SEQUENTIAL-THINKING-SERVER-SETUP.md",
    "SERVICE-ACCOUNT-ANALYSIS.md",
    "TESTING-VALIDATION-GUIDE.md",
    "VERCEL-COPY-PASTE-READY.md",
    "VERCEL-ENV-SETUP.md",
    "CONNECTION-MONITOR-README.md"
)

Write-Host "Moving configuration files..." -ForegroundColor Yellow
foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs/configuration/" -Force
        Write-Host "  Moved $file" -ForegroundColor Gray
    }
}

# Move log files to logs/
$logFiles = @(
    "connection-monitor.log",
    "sentry-monitoring-checklist.txt"
)

Write-Host "Moving log files..." -ForegroundColor Yellow
foreach ($file in $logFiles) {
    if (Test-Path $file) {
        Move-Item $file "logs/" -Force
        Write-Host "  Moved $file" -ForegroundColor Gray
    }
}

# Move MCP log files to logs/mcp/
$mcpLogFiles = @(
    "mcp-fetch.log",
    "mcp-fetch.log.err",
    "mcp-filesystem.log",
    "mcp-filesystem.log.err",
    "mcp-git.log",
    "mcp-git.log.err",
    "mcp-memory.log",
    "mcp-memory.log.err",
    "mcp-time.log",
    "mcp-time.log.err"
)

Write-Host "Moving MCP log files..." -ForegroundColor Yellow
foreach ($file in $mcpLogFiles) {
    if (Test-Path $file) {
        Move-Item $file "logs/mcp/" -Force
        Write-Host "  Moved $file" -ForegroundColor Gray
    }
}

# Move environment files to config/environment/
$envFiles = @(
    "vercel-env-import.txt",
    "vercel-env-variables.json",
    "vercel-production.env",
    "VERCEL_ENV_VARIABLES.txt"
)

Write-Host "Moving environment files..." -ForegroundColor Yellow
foreach ($file in $envFiles) {
    if (Test-Path $file) {
        Move-Item $file "config/environment/" -Force
        Write-Host "  Moved $file" -ForegroundColor Gray
    }
}

# Move scripts to scripts/ (if not already there)
$scriptFiles = @(
    "netlify-env-setup.sh",
    "setup-vercel-env.ps1",
    "start-dev-with-monitor.ps1",
    "vercel-env-setup.sh",
    "verify-deployment.sh"
)

Write-Host "Moving scripts..." -ForegroundColor Yellow
foreach ($file in $scriptFiles) {
    if (Test-Path $file) {
        Move-Item $file "scripts/" -Force
        Write-Host "  Moved $file" -ForegroundColor Gray
    }
}

# Move backup directories to archives/
$backupDirs = @(
    "gcs-backup-2025-07-29"
)

Write-Host "Moving backup directories..." -ForegroundColor Yellow
foreach ($dir in $backupDirs) {
    if (Test-Path $dir) {
        Move-Item $dir "archives/backups/" -Force
        Write-Host "  Moved $dir" -ForegroundColor Gray
    }
}

# Remove obsolete files
$obsoleteFiles = @(
    "netlify.toml",
    "test-payload.json"
)

Write-Host "Removing obsolete files..." -ForegroundColor Yellow
foreach ($file in $obsoleteFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  Removed $file" -ForegroundColor Gray
    }
}

# Check for the weird filename and remove it
if (Test-Path "--max-warnings=50") {
    Remove-Item "--max-warnings=50" -Force -Recurse
    Write-Host "  Removed --max-warnings=50" -ForegroundColor Gray
}

Write-Host "Root directory cleanup complete!" -ForegroundColor Green
Write-Host "Files organized into:" -ForegroundColor Cyan
Write-Host "  - docs/status/ - Status and completion reports" -ForegroundColor Gray
Write-Host "  - docs/deployment/ - Deployment guides and reports" -ForegroundColor Gray
Write-Host "  - docs/troubleshooting/ - Troubleshooting guides" -ForegroundColor Gray
Write-Host "  - docs/configuration/ - Setup and configuration guides" -ForegroundColor Gray
Write-Host "  - logs/ - Application logs" -ForegroundColor Gray
Write-Host "  - logs/mcp/ - MCP server logs" -ForegroundColor Gray
Write-Host "  - config/environment/ - Environment configuration files" -ForegroundColor Gray
Write-Host "  - archives/backups/ - Backup files and directories" -ForegroundColor Gray
