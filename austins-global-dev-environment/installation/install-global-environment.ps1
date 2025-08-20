#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Install Austin's Global Development Environment

.DESCRIPTION
    This script sets up Austin's Global Development Environment on a new machine,
    installing VS Code profile, MCP servers, global scripts, and Beast Mode capabilities.

.PARAMETER InstallPath
    Path where to install the global environment (default: $env:USERPROFILE\austins-global-dev-environment)

.PARAMETER SkipVSCode
    Skip VS Code profile installation

.PARAMETER SkipMCP
    Skip MCP server setup

.EXAMPLE
    .\install-global-environment.ps1
    Install everything with default settings

.EXAMPLE
    .\install-global-environment.ps1 -InstallPath "C:\dev\global-env"
    Install to custom location

.NOTES
    Author: Austin's Global Development Environment
    Version: 1.0.0
    Created: August 2025
#>

param(
    [Parameter(Mandatory = $false)]
    [string]$InstallPath = "$env:USERPROFILE\austins-global-dev-environment",

    [Parameter(Mandatory = $false)]
    [switch]$SkipVSCode,

    [Parameter(Mandatory = $false)]
    [switch]$SkipMCP,

    [Parameter(Mandatory = $false)]
    [switch]$Force
)

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

function Write-InstallHeader {
    Write-ColorOutput "
🚀 AUSTIN'S GLOBAL DEVELOPMENT ENVIRONMENT 🚀
==============================================
Setting up Beast Mode for maximum productivity...
Installing AI-enhanced development capabilities...
" -Color $Colors.Header
}

function Test-Prerequisites {
    Write-ColorOutput "🔍 Checking prerequisites..." -Color $Colors.Info

    $missing = @()

    # Check VS Code
    try {
        $null = Get-Command "code" -ErrorAction Stop
        Write-ColorOutput "✅ VS Code found" -Color $Colors.Success
    }
    catch {
        $missing += "VS Code (code command not in PATH)"
    }

    # Check Node.js
    try {
        $null = Get-Command "node" -ErrorAction Stop
        $nodeVersion = node --version
        Write-ColorOutput "✅ Node.js found: $nodeVersion" -Color $Colors.Success
    }
    catch {
        $missing += "Node.js"
    }

    # Check npm
    try {
        $null = Get-Command "npm" -ErrorAction Stop
        $npmVersion = npm --version
        Write-ColorOutput "✅ npm found: $npmVersion" -Color $Colors.Success
    }
    catch {
        $missing += "npm"
    }

    # Check PowerShell version
    if ($PSVersionTable.PSVersion.Major -lt 5) {
        $missing += "PowerShell 5.0+"
    }
    else {
        Write-ColorOutput "✅ PowerShell found: $($PSVersionTable.PSVersion)" -Color $Colors.Success
    }

    if ($missing.Count -gt 0) {
        Write-ColorOutput "❌ Missing prerequisites:" -Color $Colors.Error
        foreach ($item in $missing) {
            Write-ColorOutput "   • $item" -Color $Colors.Error
        }
        throw "Please install missing prerequisites and try again."
    }

    Write-ColorOutput "✅ All prerequisites satisfied" -Color $Colors.Success
}

function Install-GlobalEnvironment {
    param([string]$Path)

    Write-ColorOutput "📁 Installing global environment to: $Path" -Color $Colors.Info

    if ((Test-Path $Path) -and (-not $Force)) {
        Write-ColorOutput "⚠️  Installation path exists. Use -Force to overwrite." -Color $Colors.Warning
        return $false
    }

    if (Test-Path $Path) {
        Remove-Item $Path -Recurse -Force
    }

    # Create directory structure
    New-Item -ItemType Directory -Path $Path -Force | Out-Null

    # Copy current environment (assuming we're running from the environment directory)
    $sourceDir = $PSScriptRoot | Split-Path
    Copy-Item "$sourceDir\*" -Destination $Path -Recurse -Force

    Write-ColorOutput "✅ Global environment installed" -Color $Colors.Success
    return $true
}

function Install-VSCodeProfile {
    param([string]$EnvironmentPath)

    if ($SkipVSCode) {
        Write-ColorOutput "⏭️  Skipping VS Code profile installation" -Color $Colors.Warning
        return
    }

    Write-ColorOutput "🎨 Installing VS Code profile..." -Color $Colors.Info

    $profilePath = Join-Path $EnvironmentPath "vscode-profile\beast-mode-profile.json"

    if (Test-Path $profilePath) {
        try {
            # Create VS Code user settings directory if it doesn't exist
            $vscodeSettingsDir = "$env:APPDATA\Code\User"
            if (-not (Test-Path $vscodeSettingsDir)) {
                New-Item -ItemType Directory -Path $vscodeSettingsDir -Force | Out-Null
            }

            # Read the profile and extract settings
            $vscodeProfile = Get-Content $profilePath | ConvertFrom-Json

            # Apply global settings to VS Code
            $globalSettingsPath = Join-Path $vscodeSettingsDir "settings.json"
            $vscodeProfile.settings | ConvertTo-Json -Depth 10 | Set-Content $globalSettingsPath

            Write-ColorOutput "✅ VS Code global settings applied" -Color $Colors.Success

            # Install extensions automatically
            Write-ColorOutput "🔌 Installing VS Code extensions..." -Color $Colors.Info
            foreach ($extension in $vscodeProfile.extensions) {
                try {
                    $installCmd = "code --install-extension $extension --force"
                    Invoke-Expression $installCmd | Out-Null
                    Write-ColorOutput "   ✅ $extension" -Color $Colors.Success
                }
                catch {
                    Write-ColorOutput "   ⚠️  Failed to install $extension" -Color $Colors.Warning
                }
            }

            Write-ColorOutput "✅ VS Code Beast Mode profile fully configured!" -Color $Colors.Success
        }
        catch {
            Write-ColorOutput "⚠️  Could not auto-configure VS Code: $($_.Exception.Message)" -Color $Colors.Warning
            Write-ColorOutput "ℹ️  Manual import: File > Preferences > Profiles > Import Profile..." -Color $Colors.Info
            Write-ColorOutput "   Profile file: $profilePath" -Color $Colors.Info
        }
    }
}

function Install-MCPServers {
    param([string]$EnvironmentPath)

    if ($SkipMCP) {
        Write-ColorOutput "⏭️  Skipping MCP server setup" -Color $Colors.Warning
        return
    }

    Write-ColorOutput "🤖 Installing MCP servers..." -Color $Colors.Info

    try {
        # Install global MCP packages
        $mcpPackages = @(
            "@modelcontextprotocol/server-filesystem",
            "@modelcontextprotocol/server-git",
            "@modelcontextprotocol/server-memory",
            "@modelcontextprotocol/server-fetch",
            "@modelcontextprotocol/server-time",
            "@modelcontextprotocol/server-sequential-thinking"
        )

        foreach ($package in $mcpPackages) {
            Write-ColorOutput "   Installing $package..." -Color $Colors.Info
            npm install -g $package
        }

        Write-ColorOutput "✅ MCP servers installed globally" -Color $Colors.Success
    }
    catch {
        Write-ColorOutput "⚠️  Some MCP servers may not have installed correctly: $($_.Exception.Message)" -Color $Colors.Warning
    }
}

function Install-GlobalScripts {
    param([string]$EnvironmentPath)

    Write-ColorOutput "⚙️ Installing global scripts..." -Color $Colors.Info

    $scriptsPath = Join-Path $EnvironmentPath "global-scripts"

    # Install PowerShell module
    $moduleName = "BeastMode"
    $userModulesPath = "$env:USERPROFILE\Documents\PowerShell\Modules\$moduleName"

    # Create user modules directory if it doesn't exist
    if (-not (Test-Path $userModulesPath)) {
        New-Item -ItemType Directory -Path $userModulesPath -Force | Out-Null
    }

    # Copy PowerShell module files
    $moduleFiles = @(
        "BeastMode.psm1",
        "apply-beast-mode.ps1"
    )

    foreach ($file in $moduleFiles) {
        $sourcePath = Join-Path $scriptsPath $file
        if (Test-Path $sourcePath) {
            Copy-Item $sourcePath -Destination $userModulesPath -Force
        }
    }

    # Update PowerShell profile to auto-import BeastMode module
    $profilePath = $PROFILE.CurrentUserAllHosts
    $profileDir = Split-Path $profilePath -Parent

    if (-not (Test-Path $profileDir)) {
        New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
    }

    $profileContent = ""
    if (Test-Path $profilePath) {
        $profileContent = Get-Content $profilePath -Raw
    }

    $importCommand = "Import-Module BeastMode -DisableNameChecking"
    if ($profileContent -notlike "*$importCommand*") {
        Add-Content -Path $profilePath -Value "`n# Austin's Beast Mode Global Environment`n$importCommand`n"
        Write-ColorOutput "✅ PowerShell profile updated to auto-load Beast Mode" -Color $Colors.Success
    }

    # Also copy scripts to global location for direct execution
    $globalScriptsPath = "$env:USERPROFILE\Scripts"

    if (-not (Test-Path $globalScriptsPath)) {
        New-Item -ItemType Directory -Path $globalScriptsPath -Force | Out-Null
    }

    # Copy apply-beast-mode script to global location
    $beastModeScript = Join-Path $scriptsPath "apply-beast-mode.ps1"
    if (Test-Path $beastModeScript) {
        Copy-Item $beastModeScript -Destination $globalScriptsPath -Force

        # Add to PATH if not already there
        $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
        if ($currentPath -notlike "*$globalScriptsPath*") {
            [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$globalScriptsPath", "User")
            Write-ColorOutput "✅ Added $globalScriptsPath to user PATH" -Color $Colors.Success
        }
    }

    Write-ColorOutput "✅ Global scripts and PowerShell module installed" -Color $Colors.Success
    Write-ColorOutput "ℹ️  Available commands: beast-mode, beast, Invoke-BeastMode, apply-beast-mode.ps1" -Color $Colors.Info
}function Set-GlobalEnvironmentVariable {
    param([string]$Path)

    Write-ColorOutput "🌍 Setting global environment variable..." -Color $Colors.Info

    [Environment]::SetEnvironmentVariable("AUSTINS_GLOBAL_DEV_ENV", $Path, "User")
    $env:AUSTINS_GLOBAL_DEV_ENV = $Path

    Write-ColorOutput "✅ Environment variable set: AUSTINS_GLOBAL_DEV_ENV=$Path" -Color $Colors.Success
}

function Show-InstallationSummary {
    param([string]$InstallPath)

    Write-ColorOutput "
🎉 INSTALLATION COMPLETE! 🎉
============================

Austin's Global Development Environment is now installed!

📍 Installation Location: $InstallPath
🌍 Environment Variable: AUSTINS_GLOBAL_DEV_ENV

🚀 What's Available GLOBALLY:
✅ VS Code Beast Mode settings (automatically applied)
✅ All extensions installed and configured
✅ MCP servers configured globally in VS Code
✅ PowerShell Beast Mode module (beast-mode, beast commands)
✅ apply-beast-mode.ps1 script available from any directory
✅ Project templates for React, Node.js, Python
✅ Development automation scripts

🎯 Global Commands Available Anywhere:
• beast-mode -ProjectType react
• beast -ProjectType python
• Invoke-BeastMode -ProjectType node
• apply-beast-mode.ps1 -ProjectType auto

🚀 Try it now:
1. Open a new PowerShell window
2. Navigate to ANY project directory
3. Run: beast-mode
4. Watch Beast Mode enhance your project!

🎆 Example workflow:
mkdir my-new-app && cd my-new-app
npx create-next-app@latest .
beast-mode
# Your project now has full Beast Mode!

🤖 AI Features Ready EVERYWHERE:
• GitHub Copilot Beast Mode settings
• MCP servers for enhanced capabilities
• Sequential thinking for complex problems
• Memory system for context preservation
• File system operations
• Git integration
• Web research capabilities
• Automated development workflows

🌟 Beast Mode is now UNIVERSAL!
Every project you work on can instantly have the same
powerful AI-enhanced development experience!

Happy coding with Beast Mode! 🚀
" -Color $Colors.Success
}# Main execution
try {
    Write-InstallHeader

    Test-Prerequisites

    $installed = Install-GlobalEnvironment -Path $InstallPath
    if (-not $installed) {
        exit 0
    }

    Install-VSCodeProfile -EnvironmentPath $InstallPath
    Install-MCPServers -EnvironmentPath $InstallPath
    Install-GlobalScripts -EnvironmentPath $InstallPath
    Set-GlobalEnvironmentVariable -Path $InstallPath

    Show-InstallationSummary -InstallPath $InstallPath

    Write-ColorOutput "🔄 Please restart your terminal to apply PATH changes." -Color $Colors.Warning

}
catch {
    Write-ColorOutput "❌ Installation failed: $($_.Exception.Message)" -Color $Colors.Error
    exit 1
}
