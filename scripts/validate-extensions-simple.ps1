# VS Code Extension Validation Script
Write-Host "VS Code Extension Validation Report" -ForegroundColor Cyan
Write-Host "Generated: $(Get-Date)" -ForegroundColor Gray
Write-Host ("=" * 60)

# Get list of installed extensions
$installedExtensions = code --list-extensions

# Define essential extensions for the project
$essentialExtensions = @{
    "esbenp.prettier-vscode"             = "Prettier - Code formatter"
    "dbaeumer.vscode-eslint"             = "ESLint"
    "bradlc.vscode-tailwindcss"          = "Tailwind CSS IntelliSense"
    "github.copilot"                     = "GitHub Copilot"
    "github.copilot-chat"                = "GitHub Copilot Chat"
    "github.vscode-pull-request-github"  = "GitHub Pull Requests"
    "github.vscode-github-actions"       = "GitHub Actions"
    "sonarsource.sonarlint-vscode"       = "SonarLint"
    "usernamehw.errorlens"               = "Error Lens"
    "deque-systems.vscode-axe-linter"    = "axe Accessibility Linter"
    "rangav.vscode-thunder-client"       = "Thunder Client"
    "ms-python.python"                   = "Python"
    "ms-python.vscode-pylance"           = "Pylance"
    "christian-kohler.npm-intellisense"  = "npm Intellisense"
    "dsznajder.es7-react-js-snippets"    = "ES7+ React/Redux/React-Native snippets"
    "pulkitgangwar.nextjs-snippets"      = "Next.js snippets"
    "christian-kohler.path-intellisense" = "Path Intellisense"
    "formulahendry.auto-rename-tag"      = "Auto Rename Tag"
    "ritwickdey.liveserver"              = "Live Server"
    "pflannery.vscode-versionlens"       = "Version Lens"
    "redhat.vscode-yaml"                 = "YAML"
}

# Check each essential extension
Write-Host "`nChecking Essential Extensions:" -ForegroundColor White
$activeCount = 0
$missingCount = 0

foreach ($extId in $essentialExtensions.Keys) {
    $extName = $essentialExtensions[$extId]
    if ($installedExtensions -contains $extId) {
        Write-Host "  [ACTIVE] $extName" -ForegroundColor Green
        $activeCount++
    } else {
        Write-Host "  [MISSING] $extName" -ForegroundColor Red
        $missingCount++
    }
}

# Check project files for extension functionality
Write-Host "`nChecking Project File Support:" -ForegroundColor White

$fileChecks = @{
    "package.json"                           = "npm Intellisense, Version Lens"
    "eslint.config.mjs"                      = "ESLint"
    "next.config.ts"                         = "Next.js snippets"
    "tailwind.config.js"                     = "Tailwind CSS"
    ".github/workflows/ci.yml"               = "GitHub Actions"
    ".vscode/thunder-client-collection.json" = "Thunder Client"
    "src/components/"                        = "React snippets"
    "backend/package.json"                   = "npm Intellisense"
}

foreach ($file in $fileChecks.Keys) {
    $extensions = $fileChecks[$file]
    if (Test-Path $file) {
        Write-Host "  [FOUND] $file -> $extensions" -ForegroundColor Green
    } else {
        Write-Host "  [NOT FOUND] $file -> $extensions" -ForegroundColor Yellow
    }
}

# Check VS Code settings for extension configuration
Write-Host "`nChecking VS Code Settings:" -ForegroundColor White

$settingsPath = ".vscode/settings.json"
if (Test-Path $settingsPath) {
    Write-Host "  [FOUND] VS Code settings file" -ForegroundColor Green
    $settings = Get-Content $settingsPath | ConvertFrom-Json
    
    # Check key settings
    $keySettings = @{
        "editor.defaultFormatter"      = "Prettier configuration"
        "eslint.enable"                = "ESLint enabled"
        "tailwindCSS.includeLanguages" = "Tailwind CSS languages"
        "editor.codeActionsOnSave"     = "Auto-fix on save"
    }
    
    foreach ($setting in $keySettings.Keys) {
        $description = $keySettings[$setting]
        if ($settings.PSObject.Properties.Name -contains $setting) {
            Write-Host "    [CONFIGURED] $description" -ForegroundColor Green
        } else {
            Write-Host "    [NOT SET] $description" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "  [NOT FOUND] VS Code settings file" -ForegroundColor Yellow
}

# Summary
Write-Host "`n" + ("=" * 60)
Write-Host "VALIDATION SUMMARY" -ForegroundColor Cyan
Write-Host "`nExtension Status:" -ForegroundColor White
Write-Host "  Active Extensions: $activeCount" -ForegroundColor Green
Write-Host "  Missing Extensions: $missingCount" -ForegroundColor Red

# Project-specific recommendations
Write-Host "`nProject Status for Wedding Website:" -ForegroundColor White

$coreExtensions = @("esbenp.prettier-vscode", "dbaeumer.vscode-eslint", "bradlc.vscode-tailwindcss", "github.copilot", "sonarsource.sonarlint-vscode", "rangav.vscode-thunder-client")
$coreActive = 0
foreach ($ext in $coreExtensions) {
    if ($installedExtensions -contains $ext) {
        $coreActive++
    }
}

Write-Host "  Core Development Tools: $coreActive/6" -ForegroundColor $(if ($coreActive -eq 6) { "Green" } else { "Yellow" })

if ($coreActive -eq 6) {
    Write-Host "`nAll essential extensions are active and ready for development!" -ForegroundColor Green
} else {
    Write-Host "`nSome essential extensions may need attention." -ForegroundColor Yellow
}

Write-Host "`nNext Steps:" -ForegroundColor White
Write-Host "1. Verify Prettier is set as default formatter" -ForegroundColor Gray
Write-Host "2. Check ESLint is auto-fixing on save" -ForegroundColor Gray
Write-Host "3. Test Thunder Client with your API endpoints" -ForegroundColor Gray
Write-Host "4. Validate SonarLint is showing code quality issues" -ForegroundColor Gray
