# BeastMode PowerShell Module
# Austin's Global Development Environment

# Import the main apply-beast-mode functionality
$scriptPath = Join-Path $PSScriptRoot "apply-beast-mode.ps1"

function Invoke-BeastMode {
    <#
    .SYNOPSIS
        Apply Beast Mode to any project - Universal Development Environment Setup

    .DESCRIPTION
        This function applies Austin's Beast Mode development environment to any project,
        providing AI-enhanced development capabilities, optimized VS Code settings,
        MCP server integration, and automated development workflows.

    .PARAMETER ProjectType
        The type of project to configure (react, node, python, general, auto)

    .PARAMETER Force
        Force overwrite existing configurations

    .PARAMETER Minimal
        Apply minimal Beast Mode configuration (essential features only)

    .EXAMPLE
        Invoke-BeastMode -ProjectType react
        Apply Beast Mode to a React/Next.js project

    .EXAMPLE
        Invoke-BeastMode -ProjectType python -Force
        Force apply Beast Mode to a Python project

    .EXAMPLE
        beast-mode
        Auto-detect project type and apply Beast Mode
    #>

    param(
        [Parameter(Mandatory = $false)]
        [ValidateSet("react", "nextjs", "node", "nodejs", "python", "general", "auto")]
        [string]$ProjectType = "auto",

        [Parameter(Mandatory = $false)]
        [switch]$Force,

        [Parameter(Mandatory = $false)]
        [switch]$Minimal,

        [Parameter(Mandatory = $false)]
        [string]$GlobalEnvironmentPath = $null
    )

    # Build parameters for the script
    $params = @{
        ProjectType = $ProjectType
    }

    if ($Force) { $params.Force = $true }
    if ($Minimal) { $params.Minimal = $true }
    if ($GlobalEnvironmentPath) { $params.GlobalEnvironmentPath = $GlobalEnvironmentPath }

    # Execute the apply-beast-mode script
    & $scriptPath @params
}

# Create shorter aliases for convenience
Set-Alias -Name "beast-mode" -Value Invoke-BeastMode
Set-Alias -Name "beast" -Value Invoke-BeastMode
Set-Alias -Name "Apply-BeastMode" -Value Invoke-BeastMode

# Export functions and aliases
Export-ModuleMember -Function Invoke-BeastMode -Alias "beast-mode", "beast", "Apply-BeastMode"# Display module info when imported
Write-Host "🚀 Beast Mode Module Loaded!" -ForegroundColor Green
Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "  • Invoke-BeastMode" -ForegroundColor White
Write-Host "  • beast-mode" -ForegroundColor White
Write-Host "  • beast" -ForegroundColor White
Write-Host "Usage: beast-mode -ProjectType react" -ForegroundColor Yellow
