# Stop All MCP Servers Script

Write-Host "🛑 STOPPING ALL MCP SERVERS" -ForegroundColor Red
Write-Host "============================" -ForegroundColor Red
Write-Host ""

# Try to load saved job info
$jobsFile = ".\mcp-server-jobs.xml"
if (Test-Path $jobsFile) {
    try {
        $jobs = Import-Clixml -Path $jobsFile
        
        foreach ($job in $jobs) {
            if ($job.Process -and !$job.Process.HasExited) {
                Write-Host "🛑 Stopping $($job.Name) (PID: $($job.Process.Id))..." -ForegroundColor Yellow
                try {
                    $job.Process.Kill()
                    Write-Host "  ✅ $($job.Name) stopped" -ForegroundColor Green
                }
                catch {
                    Write-Host "  ⚠️  Could not stop $($job.Name): $($_.Exception.Message)" -ForegroundColor Orange
                }
            }
            else {
                Write-Host "  ℹ️  $($job.Name) was already stopped" -ForegroundColor Gray
            }
        }
        
        # Clean up the jobs file
        Remove-Item $jobsFile -Force
    }
    catch {
        Write-Host "❌ Could not load job info, falling back to process search..." -ForegroundColor Red
    }
}

# Fallback: Kill by process name patterns
$processPatterns = @("node", "python", "npx")
Write-Host ""
Write-Host "🔍 Searching for remaining MCP server processes..." -ForegroundColor Yellow

foreach ($pattern in $processPatterns) {
    $processes = Get-Process -Name $pattern -ErrorAction SilentlyContinue | Where-Object {
        $_.CommandLine -like "*mcp*" -or 
        $_.CommandLine -like "*servers/src*" -or
        $_.CommandLine -like "*mongodb-mcp-server*" -or
        $_.CommandLine -like "*playwright/mcp*"
    }
    
    foreach ($process in $processes) {
        Write-Host "🛑 Found MCP process: $($process.Name) (PID: $($process.Id))" -ForegroundColor Yellow
        try {
            $process.Kill()
            Write-Host "  ✅ Stopped PID: $($process.Id)" -ForegroundColor Green
        }
        catch {
            Write-Host "  ⚠️  Could not stop PID: $($process.Id)" -ForegroundColor Orange
        }
    }
}

Write-Host ""
Write-Host "✅ MCP SERVERS SHUTDOWN COMPLETE!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
