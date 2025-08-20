#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Apply Beast Mode to any project - Universal Development Environment Setup

.DESCRIPTION
    This script applies Austin's Beast Mode development environment to any project,
    providing AI-enhanced development capabilities, optimized VS Code settings,
    MCP server integration, and automated development workflows.

.PARAMETER ProjectType
    The type of project to configure (react, node, python, general)

.PARAMETER Force
    Force overwrite existing configurations

.PARAMETER Minimal
    Apply minimal Beast Mode configuration (essential features only)

.EXAMPLE
    .\apply-beast-mode.ps1 -ProjectType react
    Apply Beast Mode to a React/Next.js project

.EXAMPLE
    .\apply-beast-mode.ps1 -ProjectType python -Force
    Force apply Beast Mode to a Python project

.NOTES
    Author: Austin's Global Development Environment
    Version: 1.0.0
    Created: August 2025
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

# Script configuration
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Colors for output
$Colors = @{
    Success = "Green"
    Warning = "Yellow"
    Error   = "Red"
    Info    = "Cyan"
    Header  = "Magenta"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-BeastModeHeader {
    Write-ColorOutput "
🚀 BEAST MODE DEPLOYMENT SYSTEM 🚀
===================================
Austin's Global Development Environment
Applying maximum AI productivity to your project...
" -Color $Colors.Header
}

function Test-ProjectType {
    param([string]$Path = ".")

    $detectedType = "general"

    if (Test-Path (Join-Path $Path "package.json")) {
        $packageJson = Get-Content (Join-Path $Path "package.json") | ConvertFrom-Json

        if ($packageJson.dependencies -and $packageJson.dependencies.react) {
            $detectedType = "react"
        }
        elseif ($packageJson.dependencies -and $packageJson.dependencies.express) {
            $detectedType = "node"
        }
        else {
            $detectedType = "node"
        }
    }
    elseif ((Test-Path (Join-Path $Path "requirements.txt")) -or
        (Test-Path (Join-Path $Path "pyproject.toml")) -or
        (Test-Path (Join-Path $Path "setup.py"))) {
        $detectedType = "python"
    }

    return $detectedType
}

function Find-GlobalEnvironment {
    # Try to find the global development environment

    # First, check environment variable
    if ($env:AUSTINS_GLOBAL_DEV_ENV -and (Test-Path $env:AUSTINS_GLOBAL_DEV_ENV)) {
        return $env:AUSTINS_GLOBAL_DEV_ENV
    }

    # Try common installation locations
    $possiblePaths = @(
        "$env:USERPROFILE\austins-global-dev-environment",
        "C:\dev\austins-global-dev-environment",
        "$env:USERPROFILE\Documents\austins-global-dev-environment",
        "C:\Users\$env:USERNAME\austins-global-dev-environment"
    )

    foreach ($path in $possiblePaths) {
        if (Test-Path $path) {
            # Verify it's actually the global environment by checking for key files
            $keyFiles = @(
                "project-templates",
                "vscode-profile",
                "mcp-servers"
            )

            $isValid = $true
            foreach ($keyFile in $keyFiles) {
                if (-not (Test-Path (Join-Path $path $keyFile))) {
                    $isValid = $false
                    break
                }
            }

            if ($isValid) {
                return $path
            }
        }
    }

    return $null
}

function Install-VSCodeConfiguration {
    param(
        [string]$ProjectType,
        [string]$TemplatePath
    )

    Write-ColorOutput "📁 Installing VS Code configuration..." -Color $Colors.Info

    $vscodeSource = Join-Path $TemplatePath ".vscode"
    $vscodeTarget = ".\.vscode"

    if (Test-Path $vscodeTarget -and -not $Force) {
        Write-ColorOutput "⚠️  .vscode directory exists. Use -Force to overwrite." -Color $Colors.Warning
        return
    }

    if (Test-Path $vscodeSource) {
        if (Test-Path $vscodeTarget) {
            Remove-Item $vscodeTarget -Recurse -Force
        }
        Copy-Item $vscodeSource -Destination $vscodeTarget -Recurse
        Write-ColorOutput "✅ VS Code configuration installed" -Color $Colors.Success
    }
}

function Install-AIInstructions {
    param(
        [string]$ProjectType,
        [string]$TemplatePath
    )

    Write-ColorOutput "🤖 Installing AI instructions..." -Color $Colors.Info

    $githubSource = Join-Path $TemplatePath ".github"
    $githubTarget = ".\.github"

    if (-not (Test-Path $githubTarget)) {
        New-Item -ItemType Directory -Path $githubTarget -Force | Out-Null
    }

    if (Test-Path $githubSource) {
        Copy-Item "$githubSource\*" -Destination $githubTarget -Recurse -Force
        Write-ColorOutput "✅ AI instructions installed" -Color $Colors.Success
    }
}

function Install-MCPConfiguration {
    param(
        [string]$GlobalPath
    )

    Write-ColorOutput "🔧 Installing MCP server configuration..." -Color $Colors.Info

    $mcpSource = Join-Path $GlobalPath "mcp-servers"
    $mcpConfig = Join-Path $mcpSource "global-mcp-config.json"

    if (Test-Path $mcpConfig) {
        Copy-Item $mcpConfig -Destination ".\mcp-config.json" -Force
        Write-ColorOutput "✅ MCP configuration installed" -Color $Colors.Success

        # Install custom MCP servers
        $serverFiles = Get-ChildItem $mcpSource -Filter "*.ts"
        if ($serverFiles.Count -gt 0) {
            if (-not (Test-Path ".\mcp-servers")) {
                New-Item -ItemType Directory -Path ".\mcp-servers" -Force | Out-Null
            }

            foreach ($server in $serverFiles) {
                Copy-Item $server.FullName -Destination ".\mcp-servers\" -Force
            }
            Write-ColorOutput "✅ Custom MCP servers installed" -Color $Colors.Success
        }
    }
}

function Install-DevelopmentScripts {
    param(
        [string]$ProjectType,
        [string]$GlobalPath
    )

    Write-ColorOutput "⚙️ Installing development automation..." -Color $Colors.Info

    $scriptsSource = Join-Path $GlobalPath "global-scripts"

    if (Test-Path $scriptsSource) {
        if (-not (Test-Path ".\scripts")) {
            New-Item -ItemType Directory -Path ".\scripts" -Force | Out-Null
        }

        # Copy universal scripts
        $universalScripts = Get-ChildItem $scriptsSource -Filter "*universal*"
        foreach ($script in $universalScripts) {
            Copy-Item $script.FullName -Destination ".\scripts\" -Force
        }

        # Copy project-type specific scripts
        $typeScripts = Get-ChildItem $scriptsSource -Filter "*$ProjectType*"
        foreach ($script in $typeScripts) {
            Copy-Item $script.FullName -Destination ".\scripts\" -Force
        }

        Write-ColorOutput "✅ Development automation installed" -Color $Colors.Success
    }
}

function Update-PackageJson {
    param([string]$ProjectType)

    if (-not (Test-Path "package.json")) {
        return
    }

    Write-ColorOutput "📦 Updating package.json with Beast Mode scripts..." -Color $Colors.Info

    $packageJson = Get-Content "package.json" | ConvertFrom-Json

    # Add Beast Mode scripts
    if (-not $packageJson.scripts) {
        $packageJson | Add-Member -MemberType NoteProperty -Name "scripts" -Value @{}
    }

    $beastModeScripts = @{
        "beast:fix"     = "npm run lint:fix && npm run format"
        "beast:test"    = "npm test"
        "beast:build"   = "npm run build"
        "beast:clean"   = "pwsh -c 'Remove-Item -Path node_modules, .next, dist, build -Recurse -Force -ErrorAction SilentlyContinue; npm install'"
        "beast:analyze" = "npm run build:analyze"
    }

    foreach ($script in $beastModeScripts.GetEnumerator()) {
        $packageJson.scripts | Add-Member -MemberType NoteProperty -Name $script.Key -Value $script.Value -Force
    }

    $packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"
    Write-ColorOutput "✅ Package.json updated with Beast Mode scripts" -Color $Colors.Success
}

function Show-CompletionMessage {
    param([string]$ProjectType)

    Write-ColorOutput "
🎉 BEAST MODE SUCCESSFULLY APPLIED! 🎉
=====================================

Your project is now enhanced with:
✅ AI-optimized VS Code configuration
✅ GitHub Copilot Beast Mode settings
✅ MCP servers for enhanced AI capabilities
✅ Automated development workflows
✅ Code quality and formatting tools
✅ Project-specific optimizations ($ProjectType)

🚀 Quick Start Commands:
• Ctrl+Shift+P → 'Tasks: Run Task' → 'Beast Mode: Start Development'
• F6 → Auto-fix code issues
• Shift+F6 → Format document
• Ctrl+Shift+Alt+F → Fix all issues

🤖 AI Features Active:
• Sequential thinking for complex problems
• Memory system for context preservation
• File system operations
• Git integration
• Web research capabilities
• Time and timezone handling

📚 Documentation:
• Check .github/copilot-instructions.md for AI behavior
• Review .vscode/tasks.json for available commands
• Explore scripts/ directory for automation tools

Happy coding with Beast Mode! 🚀
" -Color $Colors.Success
}

# Main execution
try {
    Write-BeastModeHeader

    # Detect project type if auto
    if ($ProjectType -eq "auto") {
        $ProjectType = Test-ProjectType
        Write-ColorOutput "🔍 Detected project type: $ProjectType" -Color $Colors.Info
    }

    # Normalize project type aliases
    if ($ProjectType -eq "nextjs") { $ProjectType = "react" }
    if ($ProjectType -eq "nodejs") { $ProjectType = "node" }

    # Find global environment
    if (-not $GlobalEnvironmentPath) {
        $GlobalEnvironmentPath = Find-GlobalEnvironment
    }

    if (-not $GlobalEnvironmentPath -or -not (Test-Path $GlobalEnvironmentPath)) {
        Write-ColorOutput "❌ Global development environment not found!" -Color $Colors.Error
        Write-ColorOutput "Please ensure austins-global-dev-environment is available." -Color $Colors.Error
        exit 1
    }

    Write-ColorOutput "🌍 Using global environment: $GlobalEnvironmentPath" -Color $Colors.Info

    # Define template path
    $templatePath = Join-Path $GlobalEnvironmentPath "project-templates\$ProjectType"

    if (-not (Test-Path $templatePath)) {
        Write-ColorOutput "⚠️  Template for '$ProjectType' not found, using general template" -Color $Colors.Warning
        $templatePath = Join-Path $GlobalEnvironmentPath "project-templates\general"
        $ProjectType = "general"
    }

    # Apply Beast Mode configurations
    Install-VSCodeConfiguration -ProjectType $ProjectType -TemplatePath $templatePath
    Install-AIInstructions -ProjectType $ProjectType -TemplatePath $templatePath
    Install-MCPConfiguration -GlobalPath $GlobalEnvironmentPath

    if (-not $Minimal) {
        Install-DevelopmentScripts -ProjectType $ProjectType -GlobalPath $GlobalEnvironmentPath
        Update-PackageJson -ProjectType $ProjectType
    }

    Show-CompletionMessage -ProjectType $ProjectType

}
catch {
    Write-ColorOutput "❌ Error applying Beast Mode: $($_.Exception.Message)" -Color $Colors.Error
    exit 1
}
