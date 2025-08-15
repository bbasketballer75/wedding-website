# Check MCP Servers Status Script

Write-Host "📊 MCP SERVERS STATUS CHECK" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Try to load saved job info
$jobsFile = ".\mcp-server-jobs.xml"
if (Test-Path $jobsFile) {
    try {
        $jobs = Import-Clixml -Path $jobsFile
        
        Write-Host "🔍 Checking saved MCP server processes..." -ForegroundColor Yellow
        Write-Host ""
        
        $runningCount = 0
        $stoppedCount = 0
        
        foreach ($job in $jobs) {
            if ($job.Process -and !$job.Process.HasExited) {
                Write-Host "$($job.Icon) $($job.Name)" -ForegroundColor Green
                Write-Host "   Status: ✅ RUNNING" -ForegroundColor Green
                Write-Host "   PID: $($job.Process.Id)" -ForegroundColor Gray
                Write-Host "   Memory: $([math]::Round($job.Process.WorkingSet64/1MB, 2)) MB" -ForegroundColor Gray
                $runningCount++
            }
            else {
                Write-Host "$($job.Icon) $($job.Name)" -ForegroundColor Red
                Write-Host "   Status: ❌ STOPPED" -ForegroundColor Red
                $stoppedCount++
            }
            Write-Host ""
        }
        
        Write-Host "📊 SUMMARY:" -ForegroundColor Cyan
        Write-Host "  ✅ Running: $runningCount servers" -ForegroundColor Green
        Write-Host "  ❌ Stopped: $stoppedCount servers" -ForegroundColor Red
        
    }
    catch {
        Write-Host "❌ Could not load job info: $($_.Exception.Message)" -ForegroundColor Red
    }
}
else {
    Write-Host "⚠️  No MCP server job info found." -ForegroundColor Yellow
    Write-Host "💡 Run .\scripts\start-mcp-servers.ps1 to start all servers" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🔗 Quick Commands:" -ForegroundColor Yellow
Write-Host "  Start all: .\scripts\start-mcp-servers.ps1" -ForegroundColor Gray
Write-Host "  Stop all:  .\scripts\stop-mcp-servers.ps1" -ForegroundColor Gray
Write-Host "  Check:     .\scripts\check-mcp-servers.ps1" -ForegroundColor Gray
