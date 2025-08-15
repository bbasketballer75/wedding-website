# PowerShell script to convert JPG/PNG images to WebP format
# Requires ImageMagick or similar tool

param(
    [string]$SourceDir = "public/images",
    [switch]$DryRun = $false
)

# Check if ImageMagick is available
try {
    magick -version | Out-Null
    Write-Host "✅ ImageMagick found" -ForegroundColor Green
} catch {
    Write-Host "❌ ImageMagick not found. Please install ImageMagick first." -ForegroundColor Red
    Write-Host "Download from: https://imagemagick.org/script/download.php#windows" -ForegroundColor Yellow
    exit 1
}

# Get the workspace root
$WorkspaceRoot = Split-Path -Parent $PSScriptRoot
$ImageDir = Join-Path $WorkspaceRoot $SourceDir

Write-Host "🔍 Scanning for JPG/PNG images in: $ImageDir" -ForegroundColor Cyan

# Find all JPG, JPEG, PNG files
$ImageFiles = Get-ChildItem -Path $ImageDir -Recurse -Include *.jpg,*.jpeg,*.png

if ($ImageFiles.Count -eq 0) {
    Write-Host "ℹ️ No JPG/PNG images found to convert." -ForegroundColor Yellow
    exit 0
}

Write-Host "📋 Found $($ImageFiles.Count) images to convert" -ForegroundColor Cyan

$ConvertedCount = 0
$SkippedCount = 0
$ErrorCount = 0

foreach ($ImageFile in $ImageFiles) {
    $WebPPath = $ImageFile.FullName -replace '\.(jpg|jpeg|png)$', '.webp'
    $RelativePath = $ImageFile.FullName.Substring($WorkspaceRoot.Length + 1)
    
    # Check if WebP already exists
    if (Test-Path $WebPPath) {
        Write-Host "⏭️ Skipping $RelativePath (WebP already exists)" -ForegroundColor Yellow
        $SkippedCount++
        continue
    }
    
    if ($DryRun) {
        Write-Host "🔍 Would convert: $RelativePath → $(Split-Path -Leaf $WebPPath)" -ForegroundColor Cyan
        continue
    }
    
    try {
        Write-Host "🔄 Converting: $RelativePath" -ForegroundColor Cyan
        
        # Convert to WebP with quality 85 (good balance of size vs quality)
        magick $ImageFile.FullName -quality 85 $WebPPath
        
        if (Test-Path $WebPPath) {
            $OriginalSize = $ImageFile.Length
            $WebPSize = (Get-Item $WebPPath).Length
            $SavingsPercent = [math]::Round((($OriginalSize - $WebPSize) / $OriginalSize) * 100, 1)
            
            Write-Host "✅ Converted: $(Split-Path -Leaf $WebPPath) (${SavingsPercent}% size reduction)" -ForegroundColor Green
            $ConvertedCount++
        } else {
            Write-Host "❌ Failed to create WebP: $RelativePath" -ForegroundColor Red
            $ErrorCount++
        }
    } catch {
        Write-Host "❌ Error converting $RelativePath`: $($_.Exception.Message)" -ForegroundColor Red
        $ErrorCount++
    }
}

# Summary
Write-Host "`n📊 Conversion Summary:" -ForegroundColor Cyan
Write-Host "✅ Converted: $ConvertedCount files" -ForegroundColor Green
Write-Host "⏭️ Skipped: $SkippedCount files" -ForegroundColor Yellow
if ($ErrorCount -gt 0) {
    Write-Host "❌ Errors: $ErrorCount files" -ForegroundColor Red
}

if ($DryRun) {
    Write-Host "`nℹ️ This was a dry run. Use '-DryRun:`$false' to actually convert files." -ForegroundColor Blue
} else {
    Write-Host "`n🎉 Image conversion completed!" -ForegroundColor Green
}
