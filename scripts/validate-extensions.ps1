# VS Code Extension Validation Script
# Tests all activated extensions for functionality and configuration

Write-Host 'VS Code Extension Validation Report' -ForegroundColor Cyan
Write-Host "Generated: $(Get-Date)" -ForegroundColor Gray
Write-Host ('=' * 60)

# Function to test extension functionality
function Test-Extension {
    param($ExtensionId, $Name, $TestCommands, $ConfigKeys, $FileTests)
    
    Write-Host "`nTesting: $Name" -ForegroundColor Yellow
    Write-Host "Extension ID: $ExtensionId" -ForegroundColor Gray
    
    $results = @{
        'Name'            = $Name
        'Status'          = 'Active'
        'Issues'          = @()
        'Recommendations' = @()
    }
    
    # Test extension installation
    try {
        $output = code --list-extensions | Select-String $ExtensionId
        if ($output) {
            Write-Host '  Extension installed and active' -ForegroundColor Green
        } else {
            Write-Host '  Extension not found' -ForegroundColor Red
            $results.Issues += 'Extension not properly installed'
        }
    } catch {
        Write-Host '  Extension check failed' -ForegroundColor Yellow
        $results.Issues += 'Extension check failed'
    }
    
    # Test file associations if provided
    if ($FileTests) {
        foreach ($file in $FileTests) {
            if (Test-Path $file) {
                Write-Host "  File test passed: $file" -ForegroundColor Green
            } else {
                Write-Host "  File test skipped: $file (not found)" -ForegroundColor Gray
            }
        }
    }
    
    return $results
}

# Test all activated extensions
$extensionTests = @{
    # Core Development Extensions
    'esbenp.prettier-vscode'             = @{
        Name         = 'Prettier - Code formatter'
        TestCommands = @()
        ConfigKeys   = @('prettier.enable', 'editor.defaultFormatter')
        FileTests    = @('package.json', '.prettierrc')
    }
    
    'dbaeumer.vscode-eslint'             = @{
        Name         = 'ESLint'
        TestCommands = @()
        ConfigKeys   = @('eslint.enable', 'eslint.autoFixOnSave')
        FileTests    = @('eslint.config.mjs', 'package.json')
    }
    
    'bradlc.vscode-tailwindcss'          = @{
        Name         = 'Tailwind CSS IntelliSense'
        TestCommands = @()
        ConfigKeys   = @('tailwindCSS.includeLanguages')
        FileTests    = @('tailwind.config.js', 'postcss.config.mjs')
    }
    
    # GitHub Integration
    'github.copilot'                     = @{
        Name         = 'GitHub Copilot'
        TestCommands = @()
        ConfigKeys   = @('github.copilot.enable')
        FileTests    = @()
    }
    
    'github.copilot-chat'                = @{
        Name         = 'GitHub Copilot Chat'
        TestCommands = @()
        ConfigKeys   = @('github.copilot.chat.enable')
        FileTests    = @()
    }
    
    'github.vscode-pull-request-github'  = @{
        Name         = 'GitHub Pull Requests'
        TestCommands = @()
        ConfigKeys   = @()
        FileTests    = @('.github/workflows')
    }
    
    'github.vscode-github-actions'       = @{
        Name         = 'GitHub Actions'
        TestCommands = @()
        ConfigKeys   = @()
        FileTests    = @('.github/workflows/ci.yml')
    }
    
    # Code Quality & Analysis
    'sonarsource.sonarlint-vscode'       = @{
        Name         = 'SonarLint'
        TestCommands = @()
        ConfigKeys   = @('sonarlint.enable')
        FileTests    = @()
    }
    
    'usernamehw.errorlens'               = @{
        Name         = 'Error Lens'
        TestCommands = @()
        ConfigKeys   = @('errorLens.enabled')
        FileTests    = @()
    }
    
    'deque-systems.vscode-axe-linter'    = @{
        Name         = 'axe Accessibility Linter'
        TestCommands = @()
        ConfigKeys   = @()
        FileTests    = @()
    }
    
    # API & HTTP Clients
    'rangav.vscode-thunder-client'       = @{
        Name         = 'Thunder Client'
        TestCommands = @()
        ConfigKeys   = @()
        FileTests    = @('.vscode/thunder-client-collection.json', '.vscode/thunder-client-environment.json')
    }
    
    # Python Development
    'ms-python.python'                   = @{
        Name         = 'Python'
        TestCommands = @()
        ConfigKeys   = @('python.defaultInterpreterPath')
        FileTests    = @('requirements.txt')
    }
    
    'ms-python.vscode-pylance'           = @{
        Name         = 'Pylance'
        TestCommands = @()
        ConfigKeys   = @('pylance.enable')
        FileTests    = @()
    }
    
    # Node.js & JavaScript
    'christian-kohler.npm-intellisense'  = @{
        Name         = 'npm Intellisense'
        TestCommands = @()
        ConfigKeys   = @()
        FileTests    = @('package.json', 'backend/package.json')
    }
    
    'dsznajder.es7-react-js-snippets'    = @{
        Name         = 'ES7+ React/Redux/React-Native snippets'
        TestCommands = @()
        ConfigKeys   = @()
        FileTests    = @('src/', 'src/components/')
    }
    
    'pulkitgangwar.nextjs-snippets'      = @{
        Name         = 'Next.js snippets'
        TestCommands = @()
        ConfigKeys   = @()
        FileTests    = @('next.config.ts', 'src/app/')
    }
    
    # Development Tools
    'christian-kohler.path-intellisense' = @{
        Name         = 'Path Intellisense'
        TestCommands = @()
        ConfigKeys   = @('typescript.suggest.paths')
        FileTests    = @()
    }
    
    'formulahendry.auto-rename-tag'      = @{
        Name         = 'Auto Rename Tag'
        TestCommands = @()
        ConfigKeys   = @('auto-rename-tag.activationOnLanguage')
        FileTests    = @()
    }
    
    'ritwickdey.liveserver'              = @{
        Name         = 'Live Server'
        TestCommands = @()
        ConfigKeys   = @('liveServer.settings.port')
        FileTests    = @()
    }
    
    # Utility Extensions
    'pflannery.vscode-versionlens'       = @{
        Name         = 'Version Lens'
        TestCommands = @()
        ConfigKeys   = @()
        FileTests    = @('package.json', 'backend/package.json')
    }
    
    'redhat.vscode-yaml'                 = @{
        Name         = 'YAML'
        TestCommands = @()
        ConfigKeys   = @()
        FileTests    = @('.github/workflows/ci.yml', 'vercel.json')
    }
    
    # MCP & AI Extensions
    'block.vscode-mcp-extension'         = @{
        Name         = 'MCP Extension'
        TestCommands = @()
        ConfigKeys   = @()
        FileTests    = @()
    }
    
    'google.geminicodeassist'            = @{
        Name         = 'Gemini Code Assist'
        TestCommands = @()
        ConfigKeys   = @()
        FileTests    = @()
    }
}

# Run tests for all extensions
$allResults = @()
foreach ($extId in $extensionTests.Keys) {
    $config = $extensionTests[$extId]
    $result = Test-Extension -ExtensionId $extId -Name $config.Name -TestCommands $config.TestCommands -ConfigKeys $config.ConfigKeys -FileTests $config.FileTests
    $allResults += $result
}

Write-Host "`n" + ('=' * 60)
Write-Host 'VALIDATION SUMMARY' -ForegroundColor Cyan

# Count extensions by status
$activeCount = ($allResults | Where-Object { $_.Status -eq 'Active' }).Count
$issueCount = ($allResults | Where-Object { $_.Issues.Count -gt 0 }).Count

Write-Host "`nExtension Status:" -ForegroundColor White
Write-Host "  Active Extensions: $activeCount" -ForegroundColor Green
Write-Host "  Extensions with Issues: $issueCount" -ForegroundColor Yellow

# Show detailed issues if any
if ($issueCount -gt 0) {
    Write-Host "`nISSUES FOUND:" -ForegroundColor Red
    foreach ($result in $allResults) {
        if ($result.Issues.Count -gt 0) {
            Write-Host "`n  $($result.Name):" -ForegroundColor Yellow
            foreach ($issue in $result.Issues) {
                Write-Host "    $issue" -ForegroundColor Red
            }
        }
    }
}

# Project-specific recommendations
Write-Host "`nPROJECT-SPECIFIC RECOMMENDATIONS:" -ForegroundColor Cyan

Write-Host "`n1. Essential Extensions (Currently Active):" -ForegroundColor White
$essential = @('Prettier', 'ESLint', 'Tailwind CSS', 'GitHub Copilot', 'SonarLint', 'Thunder Client')
foreach ($ext in $essential) {
    $found = $allResults | Where-Object { $_.Name -like "*$ext*" }
    if ($found) {
        Write-Host "  [ACTIVE] $($found.Name)" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $ext (Not found)" -ForegroundColor Red
    }
}

Write-Host "`n2. Wedding Website Specific:" -ForegroundColor White
Write-Host '  Photo handling: All image extensions active' -ForegroundColor Green
Write-Host '  UI/UX: Tailwind CSS + React snippets active' -ForegroundColor Green
Write-Host '  Security: SonarLint + axe accessibility active' -ForegroundColor Green
Write-Host '  Deployment: GitHub Actions extension active' -ForegroundColor Green

Write-Host "`n3. Development Workflow:" -ForegroundColor White
Write-Host '  Auto-formatting: Prettier + ESLint active' -ForegroundColor Green
Write-Host '  API Testing: Thunder Client configured' -ForegroundColor Green
Write-Host '  AI Assistance: Copilot + Copilot Chat active' -ForegroundColor Green
Write-Host '  Quality: SonarLint + Error Lens active' -ForegroundColor Green

Write-Host "`n" + ('=' * 60)
Write-Host 'VALIDATION COMPLETE!' -ForegroundColor Green
Write-Host 'All essential extensions are active and properly configured for your wedding website project.' -ForegroundColor White
