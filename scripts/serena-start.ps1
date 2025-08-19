# Serena MCP Server Start Script
param(
    [ValidateSet('stdio', 'sse')]
    [string]$Mode = 'stdio',
    [int]$Port = 9121,
    [string]$Context = 'ide-assistant',
    [switch]$Background
)

Write-Host "🚀 Starting Serena MCP Server ($Mode)" -ForegroundColor Green

# Ensure uvx is available
$uvx = Get-Command uvx -ErrorAction SilentlyContinue
if (-not $uvx) {
    Write-Host "❌ 'uvx' was not found on PATH." -ForegroundColor Red
    Write-Host "👉 Install 'uv' from https://docs.astral.sh/uv/getting-started/installation/ then re-run." -ForegroundColor Yellow
    exit 1
}

$projectPath = (Get-Location).Path
$serenaArgs = @('--from', 'git+https://github.com/oraios/serena', 'serena', 'start-mcp-server', '--context', $Context, '--project', $projectPath)

if ($Mode -eq 'sse') {
    $serenaArgs += @('--transport', 'sse', '--port', $Port)
}

Write-Host "🔧 Command: uvx $($serenaArgs -join ' ')" -ForegroundColor DarkGray

if ($Background) {
    Start-Process -FilePath "uvx" -ArgumentList $serenaArgs -NoNewWindow
    Write-Host "🎯 Serena MCP server started in background" -ForegroundColor Green
}
else {
    & uvx @serenaArgs
}
