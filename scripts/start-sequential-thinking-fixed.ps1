# Sequential Thinking Server Auto-Startup Script
# Ensures the MCP Sequential Thinking Server is always running

param(
    [switch]$Force,      # Force restart even if running
    [switch]$Status,     # Just show status
    [switch]$Stop,       # Stop the server
    [switch]$Quiet       # Minimal output
)

$ServerName = "MCP Sequential Thinking Server"
$ServerPath = "C:\Users\Austin\Documents\GitHub\servers\src\sequentialthinking\dist\index.js"
$ProcessName = "node"
$LogFile = "$PSScriptRoot\..\logs\sequential-thinking.log"

# Ensure logs directory exists
$LogDir = Split-Path -Parent $LogFile
if (!(Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

function Write-Log {
    param($Message, $Level = "INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] [$Level] $Message"
    
    if (!$Quiet) {
        switch ($Level) {
            "ERROR" { Write-Host $LogEntry -ForegroundColor Red }
            "WARNING" { Write-Host $LogEntry -ForegroundColor Yellow }
            "SUCCESS" { Write-Host $LogEntry -ForegroundColor Green }
            default { Write-Host $LogEntry -ForegroundColor White }
        }
    }
    
    Add-Content -Path $LogFile -Value $LogEntry
}

function Get-ServerProcess {
    return Get-Process -Name $ProcessName -ErrorAction SilentlyContinue | 
           Where-Object { $_.CommandLine -like "*$ServerPath*" }
}

function Test-ServerRunning {
    $process = Get-ServerProcess
    return $null -ne $process
}

function Start-SequentialThinkingServer {
    Write-Log "Starting $ServerName..." "INFO"
    
    # Check if server file exists
    if (!(Test-Path $ServerPath)) {
        Write-Log "Server file not found at: $ServerPath" "ERROR"
        Write-Log "Building server..." "INFO"
        
        $BuildPath = "C:\Users\Austin\Documents\GitHub\servers\src\sequentialthinking"
        try {
            Push-Location $BuildPath
            npm run build
            Pop-Location
            Write-Log "Server built successfully" "SUCCESS"
        }
        catch {
            Write-Log "Failed to build server: $($_.Exception.Message)" "ERROR"
            Pop-Location
            return $false
        }
    }
    
    # Start the server
    try {
        $process = Start-Process -FilePath "node" -ArgumentList $ServerPath -PassThru -WindowStyle Hidden
        Write-Log "$ServerName started with PID: $($process.Id)" "SUCCESS"
        
        # Wait a bit and verify it's still running
        Start-Sleep -Seconds 2
        if (Test-ServerRunning) {
            Write-Log "$ServerName is running successfully" "SUCCESS"
            return $true
        } else {
            Write-Log "$ServerName failed to start or crashed immediately" "ERROR"
            return $false
        }
    }
    catch {
        Write-Log "Failed to start $ServerName - $($_.Exception.Message)" "ERROR"
        return $false
    }
}

function Stop-SequentialThinkingServer {
    $process = Get-ServerProcess
    if ($process) {
        Write-Log "Stopping $ServerName (PID: $($process.Id))..." "INFO"
        try {
            $process | Stop-Process -Force
            Write-Log "$ServerName stopped successfully" "SUCCESS"
            return $true
        }
        catch {
            Write-Log "Failed to stop $ServerName - $($_.Exception.Message)" "ERROR"
            return $false
        }
    } else {
        Write-Log "$ServerName is not running" "INFO"
        return $true
    }
}

function Show-ServerStatus {
    $isRunning = Test-ServerRunning
    $process = Get-ServerProcess
    
    Write-Host "`n=== $ServerName Status ===" -ForegroundColor Cyan
    
    if ($isRunning) {
        Write-Host "Status: " -NoNewline -ForegroundColor White
        Write-Host "RUNNING" -ForegroundColor Green
        Write-Host "PID: " -NoNewline -ForegroundColor White
        Write-Host "$($process.Id)" -ForegroundColor Yellow
        Write-Host "Started: " -NoNewline -ForegroundColor White
        Write-Host "$($process.StartTime)" -ForegroundColor Yellow
        Write-Host "Memory: " -NoNewline -ForegroundColor White
        Write-Host "$([math]::Round($process.WorkingSet / 1MB, 2)) MB" -ForegroundColor Yellow
    } else {
        Write-Host "Status: " -NoNewline -ForegroundColor White
        Write-Host "NOT RUNNING" -ForegroundColor Red
    }
    
    Write-Host "Server Path: " -NoNewline -ForegroundColor White
    Write-Host "$ServerPath" -ForegroundColor Gray
    Write-Host "Log File: " -NoNewline -ForegroundColor White
    Write-Host "$LogFile" -ForegroundColor Gray
    Write-Host ""
}

# Main execution logic
try {
    if ($Status) {
        Show-ServerStatus
        exit 0
    }
    
    if ($Stop) {
        Stop-SequentialThinkingServer
        exit 0
    }
    
    $isRunning = Test-ServerRunning
    
    if ($Force -and $isRunning) {
        Write-Log "Force restart requested, stopping current instance..." "INFO"
        Stop-SequentialThinkingServer
        Start-Sleep -Seconds 1
        $isRunning = $false
    }
    
    if (!$isRunning) {
        $success = Start-SequentialThinkingServer
        if (!$success) {
            Write-Log "Failed to start $ServerName" "ERROR"
            exit 1
        }
    } else {
        Write-Log "$ServerName is already running" "INFO"
    }
    
    if (!$Quiet) {
        Show-ServerStatus
    }
    
    Write-Log "$ServerName management completed successfully" "SUCCESS"
}
catch {
    Write-Log "Error in sequential thinking server management - $($_.Exception.Message)" "ERROR"
    exit 1
}
