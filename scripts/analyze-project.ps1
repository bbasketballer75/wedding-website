# Analyze project file extensions distribution
Write-Host "🔍 Analyzing project structure..." -ForegroundColor Cyan

try {
    Get-ChildItem -Recurse -File |
    Where-Object { $_.Extension -in @('.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.json', '.md') } |
    Group-Object Extension |
    Sort-Object Count -Descending |
    Format-Table -AutoSize Name, Count
}
catch {
    Write-Error $_
    exit 1
}
