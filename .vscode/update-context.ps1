# .vscode/update-context.ps1
param([string]$ProjectRoot = $PSScriptRoot)

try {
    # Create context file
    $contextFile = "$ProjectRoot\.copilot_context.txt"
    
    "# Windows 11 Project Context - Generated $(Get-Date)`n" | Out-File $contextFile -Encoding UTF8
    
    # Get file structure (excluding common directories)
    "`n# File Structure (Max Depth 3)`n" | Add-Content $contextFile
    Get-ChildItem -Path $ProjectRoot -Recurse -Depth 3 -File |
        Where-Object { 
            $_.FullName -notmatch 'node_modules|\.git|\.vscode|dist|build' -and
            $_.Length -lt 500KB  # Skip large files
        } |
        ForEach-Object { "• $($_.FullName)" } | 
        Add-Content $contextFile
    
    # Add key file contents (only text-based files)
    "`n`n# File Contents`n" | Add-Content $contextFile
    Get-ChildItem -Path $ProjectRoot -Recurse -File |
        Where-Object { 
            $_.Extension -in '.js', '.ts', '.json', '.html', '.css', '.md' -and
            $_.FullName -notmatch 'node_modules|\.git' -and
            $_.Length -lt 50KB
        } |
        ForEach-Object {
            "`n===== $($_.Name) =====`n"
            try {
                Get-Content $_.FullName -Raw -ErrorAction Stop
            }
            catch {
                "[Content not readable: $($_.Exception.Message)]"
            }
        } | Add-Content $contextFile
    
    Write-Host "✅ Context updated successfully at $contextFile" -ForegroundColor Green
    exit 0
}
catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    exit 1
}