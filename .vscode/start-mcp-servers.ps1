#!/usr/bin/env pwsh

# 🚀 MCP SERVERS STARTUP SCRIPT
# Starts all 9+ MCP servers for maximum AI capabilities

param(
    [switch]$Status,
    [switch]$Stop,
    [switch]$Restart,
    [switch]$Force
)

$MCPServers = @(
    @{
        Name = "MCP Filesystem"
        Command = "npx"
        Args = @("-y", "@modelcontextprotocol/server-filesystem", "C:\Users\Austin\Downloads\wedding-website")
        Port = 8080
        LogFile = "mcp-filesystem.log"
    },
    @{
        Name = "MCP Memory"
        Command = "npx"
        Args = @("-y", "@modelcontextprotocol/server-memory")
        Port = 8081
        LogFile = "mcp-memory.log"
    },
    @{
        Name = "MCP Fetch"
        Command = "npx"
        Args = @("-y", "@modelcontextprotocol/server-fetch")
        Port = 8082
        LogFile = "mcp-fetch.log"
    },
    @{
        Name = "MCP Time"
        Command = "npx"
        Args = @("-y", "@modelcontextprotocol/server-time")
        Port = 8083
        LogFile = "mcp-time.log"
    },
    @{
        Name = "MCP Git"
        Command = "npx"
        Args = @("-y", "@modelcontextprotocol/server-git", "C:\Users\Austin\Downloads\wedding-website")
        Port = 8084
        LogFile = "mcp-git.log"
    },
    @{
        Name = "MCP Playwright"
        Command = "npx"
        Args = @("-y", "@modelcontextprotocol/server-playwright")
        Port = 8085
        LogFile = "mcp-playwright.log"
    },
    @{
        Name = "MCP Sequential Thinking"
        Command = "npx"
        Args = @("-y", "@modelcontextprotocol/server-sequential-thinking")
        Port = 8086
        LogFile = "mcp-sequential.log"
    },
    @{
        Name = "MCP Image Processing"
        Command = "npx"
        Args = @("-y", "@modelcontextprotocol/server-image-processing")
        Port = 8087
        LogFile = "mcp-image.log"
    },
    @{
        Name = "MCP HTTP Client"
        Command = "npx"
        Args = @("-y", "@modelcontextprotocol/server-http-client")
        Port = 8088
        LogFile = "mcp-http.log"
    }
)

function Write-MCPLog {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch($Level) {
        "ERROR" { "Red" }
        "WARN" { "Yellow" }
        "SUCCESS" { "Green" }
        "MCP" { "Cyan" }
        default { "White" }
    }
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
}

function Test-MCPServer {
    param([hashtable]$Server)
    
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port $Server.Port -InformationLevel Quiet -WarningAction SilentlyContinue
        return $connection
    } catch {
        return $false
    }
}

function Start-MCPServer {
    param([hashtable]$Server)
    
    Write-MCPLog "Starting $($Server.Name)..." "MCP"
    
    $processArgs = @{
        FilePath = $Server.Command
        ArgumentList = $Server.Args
        WindowStyle = "Hidden"
        PassThru = $true
        RedirectStandardOutput = $Server.LogFile
        RedirectStandardError = "$($Server.LogFile).err"
    }
    
    try {
        $process = Start-Process @processArgs
        Start-Sleep -Seconds 2
        
        if (Test-MCPServer $Server) {
            Write-MCPLog "✅ $($Server.Name) started successfully on port $($Server.Port)" "SUCCESS"
            return $process
        } else {
            Write-MCPLog "❌ $($Server.Name) failed to start on port $($Server.Port)" "ERROR"
            return $null
        }
    } catch {
        Write-MCPLog "❌ Failed to start $($Server.Name): $($_.Exception.Message)" "ERROR"
        return $null
    }
}

function Show-MCPStatus {
    Write-MCPLog "🔍 Checking MCP Server Status..." "MCP"
    Write-Host ""
    
    $runningCount = 0
    foreach ($server in $MCPServers) {
        $isRunning = Test-MCPServer $server
        if ($isRunning) {
            Write-Host "✅ $($server.Name) - Port $($server.Port) - RUNNING" -ForegroundColor Green
            $runningCount++
        } else {
            Write-Host "❌ $($server.Name) - Port $($server.Port) - STOPPED" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-MCPLog "📊 Status: $runningCount/$($MCPServers.Count) MCP servers running" "INFO"
    
    if ($runningCount -eq $MCPServers.Count) {
        Write-MCPLog "🎉 All MCP servers are operational!" "SUCCESS"
    } elseif ($runningCount -gt 0) {
        Write-MCPLog "⚠️  Some MCP servers are not running" "WARN"
    } else {
        Write-MCPLog "🚨 No MCP servers are running" "ERROR"
    }
    
    return $runningCount
}

function Stop-MCPServers {
    Write-MCPLog "🛑 Stopping all MCP servers..." "MCP"
    
    $processes = Get-Process | Where-Object {$_.ProcessName -eq "node" -and $_.Path -like "*npx*"}
    foreach ($process in $processes) {
        try {
            $process.Kill()
            Write-MCPLog "Stopped process $($process.Id)" "INFO"
        } catch {
            Write-MCPLog "Failed to stop process $($process.Id)" "WARN"
        }
    }
}

function Start-AllMCPServers {
    Write-MCPLog "🚀 Starting all MCP servers..." "MCP"
    
    $startedCount = 0
    foreach ($server in $MCPServers) {
        if (-not (Test-MCPServer $server)) {
            $process = Start-MCPServer $server
            if ($process) {
                $startedCount++
            }
        } else {
            Write-MCPLog "$($server.Name) is already running" "INFO"
            $startedCount++
        }
    }
    
    Write-Host ""
    Write-MCPLog "📊 Started: $startedCount/$($MCPServers.Count) MCP servers" "INFO"
    
    # Wait a moment for all servers to fully initialize
    Write-MCPLog "⏱️  Waiting for servers to initialize..." "INFO"
    Start-Sleep -Seconds 5
    
    # Final status check
    Show-MCPStatus | Out-Null
}

# Main execution logic
switch ($true) {
    $Status {
        Show-MCPStatus
        break
    }
    $Stop {
        Stop-MCPServers
        break
    }
    $Restart {
        Stop-MCPServers
        Start-Sleep -Seconds 3
        Start-AllMCPServers
        break
    }
    default {
        # Default: Start all servers
        Start-AllMCPServers
    }
}

Write-MCPLog "🤖 MCP Server management complete" "MCP"