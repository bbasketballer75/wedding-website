# Quick GCP Project Check
# This script helps verify your access to the GCP project

Write-Host '🔍 Checking GCP Project Access...' -ForegroundColor Cyan
Write-Host ''

# Check if gcloud CLI is installed
$gcloudVersion = $null
try {
    $gcloudVersion = gcloud --version 2>$null
    if ($gcloudVersion) {
        Write-Host '✅ Google Cloud CLI is installed' -ForegroundColor Green
        
        # Get current project
        $currentProject = gcloud config get-value project 2>$null
        if ($currentProject) {
            Write-Host "📋 Current project: $currentProject" -ForegroundColor Yellow
            
            if ($currentProject -eq 'wedding-website-final') {
                Write-Host "✅ You're already in the correct project!" -ForegroundColor Green
            } else {
                Write-Host '⚠️  Expected project: wedding-website-final' -ForegroundColor Yellow
                Write-Host '💡 Run: gcloud config set project wedding-website-final' -ForegroundColor Cyan
            }
        }
        
        # List available projects
        Write-Host ''
        Write-Host '📂 Available projects:' -ForegroundColor Cyan
        gcloud projects list --format="table(projectId,name)" 2>$null
        
    }
} catch {
    Write-Host '❌ Google Cloud CLI not found' -ForegroundColor Red
    Write-Host '💡 Install from: https://cloud.google.com/sdk/docs/install' -ForegroundColor Cyan
}

Write-Host ''
Write-Host '🌐 Manual Options:' -ForegroundColor Cyan
Write-Host '1. Open Google Cloud Console: https://console.cloud.google.com/' -ForegroundColor White
Write-Host "2. Check if you have access to 'wedding-website-final' project" -ForegroundColor White
Write-Host '3. If not, create a new project for your wedding website' -ForegroundColor White

Write-Host ''
Write-Host '📖 Full setup guide: .\docs\GCP-CREDENTIALS-SETUP.md' -ForegroundColor Green
