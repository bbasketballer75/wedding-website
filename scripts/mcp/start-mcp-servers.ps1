# MCP Servers Startup Script
# Run this to start all your MCP servers at once

Write-Host "🚀 STARTING ALL MCP SERVERS" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host ""

# Array of MCP server commands
$servers = @(
    @{
        Name = "Filesystem Server"
        Command = "node"
        Args = @("C:/Users/Austin/Documents/GitHub/servers/src/filesystem/dist/index.js", $PWD)
        Icon = "📁"
    },
    @{
        Name = "Fetch Server"
        Command = "python"
        Args = @("-m", "mcp_server_fetch")
        WorkingDirectory = "C:/Users/Austin/Documents/GitHub/servers/src/fetch/src"
        Icon = "🌐"
    },
    @{
        Name = "Time Server"
        Command = "python"
        Args = @("-m", "mcp_server_time")
        WorkingDirectory = "C:/Users/Austin/Documents/GitHub/servers/src/time/src"
        Icon = "🕒"
    },
    @{
        Name = "MongoDB Server"
        Command = "cmd"
        Args = @("/c", "npx", "tsx", "C:/Users/Austin/Documents/GitHub/mongodb-mcp-server/src/index.ts")
        Icon = "🍃"
    },
    @{
        Name = "Git Server"
        Command = "cmd"
        Args = @("/c", "npx", "-y", "mcp-git", $PWD)
        Icon = "🔗"
    },
    @{
        Name = "Playwright Server"
        Command = "cmd"
        Args = @("/c", "npx", "-y", "@playwright/mcp")
        Icon = "🎭"
    },
    @{
        Name = "Sequential Thinking Server"
        Command = "node"
        Args = @("C:/Users/Austin/Documents/GitHub/servers/src/sequentialthinking/dist/index.js")
        Icon = "🧠"
    },
    @{
        Name = "Memory Server"
        Command = "node"
        Args = @("C:/Users/Austin/Documents/GitHub/servers/src/memory/dist/index.js", $PWD)
        Icon = "💾"
    }
)

# Start each server in background
$jobs = @()
foreach ($server in $servers) {
    Write-Host "$($server.Icon) Starting $($server.Name)..." -ForegroundColor Cyan
    
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = $server.Command
    $startInfo.Arguments = $server.Args -join " "
    if ($server.WorkingDirectory) {
        $startInfo.WorkingDirectory = $server.WorkingDirectory
    }
    $startInfo.UseShellExecute = $false
    $startInfo.CreateNoWindow = $true
    
    try {
        $process = [System.Diagnostics.Process]::Start($startInfo)
        $jobs += @{
            Name = $server.Name
            Process = $process
            Icon = $server.Icon
        }
        Write-Host "  ✅ $($server.Name) started (PID: $($process.Id))" -ForegroundColor Green
    }
    catch {
        Write-Host "  ❌ Failed to start $($server.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "🎉 MCP SERVERS STARTUP COMPLETE!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "Running servers:" -ForegroundColor Yellow
foreach ($job in $jobs) {
    if ($job.Process -and !$job.Process.HasExited) {
        Write-Host "  $($job.Icon) $($job.Name) - PID: $($job.Process.Id)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "💡 To stop all servers later, run: .\scripts\stop-mcp-servers.ps1" -ForegroundColor Yellow
Write-Host "📊 To check server status, run: .\scripts\check-mcp-servers.ps1" -ForegroundColor Yellow
Write-Host ""

# Save process info for later management
$jobs | Export-Clixml -Path ".\mcp-server-jobs.xml"

Write-Host "🚀 All MCP servers are now running in the background!" -ForegroundColor Green
