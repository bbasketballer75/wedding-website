# Serena Project Indexing Script
param(
    [string]$ProjectPath
)

Write-Host "📚 Indexing project for Serena (faster tools)" -ForegroundColor Cyan

$uvx = Get-Command uvx -ErrorAction SilentlyContinue
if (-not $uvx) {
    Write-Host "❌ 'uvx' was not found on PATH." -ForegroundColor Red
    Write-Host "👉 Install 'uv' from https://docs.astral.sh/uv/getting-started/installation/ then re-run." -ForegroundColor Yellow
    exit 1
}

if (-not $ProjectPath) { $ProjectPath = (Get-Location).Path }

Push-Location $ProjectPath
try {
    uvx --from git+https://github.com/oraios/serena serena project index
}
finally {
    Pop-Location
}

Write-Host "✅ Serena indexing completed" -ForegroundColor Green
