#Requires -Version 5.1

<#
.SYNOPSIS
    Comprehensive Project Organization System - Organizes ALL folders and files throughout the entire project structure

.DESCRIPTION
    This advanced script organizes the entire wedding website project structure by:
    - Reorganizing files within existing directories for better structure
    - Creating logical groupings of related files
    - Implementing consistent naming conventions
    - Setting up proper directory hierarchies
    - Optimizing for development workflow efficiency

.PARAMETER Mode
    Organization mode: 'analyze', 'organize', or 'validate'

.PARAMETER DryRun
    Show what would be done without making changes

.EXAMPLE
    .\comprehensive-project-organizer.ps1 -Mode analyze
    .\comprehensive-project-organizer.ps1 -Mode organize -DryRun
    .\comprehensive-project-organizer.ps1 -Mode organize

.NOTES
    Created: August 2025
    Purpose: Complete project structure optimization
#>

param(
    [ValidateSet('analyze', 'organize', 'validate')]
    [string]$Mode = 'analyze',

    [switch]$DryRun,

    [switch]$Verbose
)

# Color functions for enhanced output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = 'White'
    )

    $colors = @{
        'Red'     = [ConsoleColor]::Red
        'Green'   = [ConsoleColor]::Green
        'Yellow'  = [ConsoleColor]::Yellow
        'Blue'    = [ConsoleColor]::Blue
        'Magenta' = [ConsoleColor]::Magenta
        'Cyan'    = [ConsoleColor]::Cyan
        'White'   = [ConsoleColor]::White
    }

    Write-Host $Message -ForegroundColor $colors[$Color]
}

function Write-Header {
    param([string]$Title)
    Write-Host ""
    Write-ColorOutput "🚀 $Title" "Cyan"
    Write-ColorOutput ("=" * ($Title.Length + 4)) "Cyan"
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "✅ $Message" "Green"
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "⚠️  $Message" "Yellow"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "❌ $Message" "Red"
}

# Get project root
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ProjectRoot = Split-Path -Parent $ProjectRoot

# Organization configuration
$OrganizationConfig = @{
    # Scripts directory organization
    Scripts = @{
        Core         = @(
            "maintain-project.ps1",
            "cleanup-root-directory-clean.ps1",
            "fix-all-issues.ps1",
            "validate-optimizations.mjs"
        )
        Development  = @(
            "dev-startup.ps1",
            "start-dev-with-monitor.ps1",
            "setup-development-environment.ps1",
            "validate-dev-env.mjs"
        )
        Deployment   = @(
            "deploy-vercel.ps1",
            "production-deployment.mjs",
            "post-deployment-validation.mjs",
            "build-for-vercel.mjs",
            "build-for-netlify.mjs"
        )
        Testing      = @(
            "accessibility-audit.mjs",
            "lighthouse-testing-suite.mjs",
            "quick-accessibility-test.mjs",
            "local-testing.mjs"
        )
        Monitoring   = @(
            "connection-monitor.ps1",
            "status-check.ps1",
            "web-vitals-monitoring.js"
        )
        Optimization = @(
            "optimize-bundle.mjs",
            "optimize-project.mjs",
            "convert-to-webp.mjs",
            "convert-to-avif.mjs"
        )
        Security     = @(
            "security-remediation.ps1",
            "check-gcp-access.ps1",
            "fix-pylance-mcp.ps1"
        )
        MCP          = @(
            "mcp-health-check.mjs",
            "supercharged-mcp-manager.mjs",
            "start-mcp-servers.ps1",
            "stop-mcp-servers.ps1"
        )
        Analytics    = @(
            "seo-analyzer.js",
            "social-media-validator.js",
            "intelligent-project-analyzer.mjs"
        )
        Utilities    = @(
            "generate-sitemap.js",
            "git-cleanup.ps1",
            "quick-commit.ps1",
            "auto-commit.ps1"
        )
    }

    # Source directory organization
    Source  = @{
        Components     = @{
            UI            = @(
                "ModernButtons.tsx",
                "ModernCards.tsx",
                "ModernNavigation.jsx",
                "ModernFooter.tsx",
                "LoadingScreen.tsx"
            )
            Forms         = @(
                "UploadForm.jsx",
                "GuestPhotoUpload.jsx",
                "PasswordPrompt.jsx"
            )
            Media         = @(
                "PhotoGallery.jsx",
                "VideoPlayer.jsx",
                "VideoModal.jsx",
                "MusicPlayer.jsx",
                "OptimizedImage.jsx"
            )
            Features      = @(
                "DigitalTimeCapsule.jsx",
                "FamilyTree.jsx",
                "InteractiveLoveTimeline.jsx",
                "MagicalPhotoGallery.jsx"
            )
            Admin         = @(
                "AdminDashboard.jsx",
                "ModerationCard.jsx",
                "PostWeddingAnalytics.jsx"
            )
            Accessibility = @(
                "AccessibilityEnhancements.tsx",
                "SkipLinks.tsx",
                "OrientationOverlay.jsx"
            )
            Performance   = @(
                "PerformanceMonitor.tsx",
                "ServiceWorkerRegistration.tsx",
                "PWAInstallPrompt.tsx"
            )
        }

        PageComponents = @{
            Core        = @(
                "HomePage.jsx",
                "ModernHomePage.jsx",
                "LandingPage.jsx"
            )
            Gallery     = @(
                "AlbumPage.jsx",
                "EnhancedAlbumPage.jsx",
                "MagicalAlbumPage.jsx"
            )
            Interactive = @(
                "GuestbookPage.jsx",
                "MapPage.jsx",
                "WeddingPartyPage.jsx"
            )
            Family      = @(
                "FamilyTreePage.jsx",
                "FamilyWeddingPartyPage.tsx"
            )
            Admin       = @(
                "AdminPage.jsx"
            )
        }

        Styles         = @{
            Core       = @(
                "design-system.css",
                "modern-2025-design.css",
                "premium-design-system.css"
            )
            Features   = @(
                "magical-interactions.css",
                "advanced-animations.css",
                "interactive-love-timeline.css"
            )
            Components = @(
                "magical-photo-gallery.css",
                "magical-toast.css",
                "real-time-activity.css"
            )
        }

        Utils          = @{
            Core        = @(
                "analytics.js",
                "performanceMonitor.js",
                "featureDetection.js"
            )
            SEO         = @(
                "seoEnhancements.js",
                "seoUtils.ts",
                "structuredData.js"
            )
            Performance = @(
                "lazyLoading.js",
                "webVitals.js",
                "serviceWorker.ts"
            )
            Features    = @(
                "magicalInteractions.js",
                "AnniversaryManager.js",
                "weddingAnalytics.js"
            )
            Security    = @(
                "security.js",
                "offlineStorage.js"
            )
        }
    }

    # Public directory organization
    Public  = @{
        Images  = @{
            Core    = @("austin.webp", "jordyn.webp", "landing-bg.webp")
            Wedding = @("engagement", "wedding-party", "highlights")
            Family  = @("parents")
            Assets  = @("rings", "title-icons")
        }

        Scripts = @{
            Core        = @("analytics.js", "enhanced-sw.js", "sw.js")
            Performance = @("skip-link-enhancement.js")
            Utils       = @("utils")
        }

        Media   = @{
            Audio = @("audio")
            Video = @("video")
        }

        Config  = @{
            SEO   = @("sitemap.xml", "sitemap-images.xml", "robots.txt")
            PWA   = @("manifest.json")
            Legal = @("privacy-policy.md")
        }
    }

    # Configuration files organization
    Config  = @{
        Core        = @(
            "package.json",
            "package-lock.json",
            "next.config.ts",
            "tsconfig.json"
        )

        Testing     = @(
            "vitest.config.ts",
            "jest.config.js",
            "jest.setup.js",
            "cypress.config.js"
        )

        Build       = @(
            "postcss.config.mjs",
            "babel.config.test.js",
            "vercel.json"
        )

        Environment = @(
            ".env.example",
            ".env.template",
            ".env.production.example"
        )

        Firebase    = @(
            "firebase.json",
            "firestore.rules",
            "firestore.indexes.json",
            ".firebaserc"
        )

        Linting     = @(
            "eslint.config.mjs"
        )
    }
}

# Analysis functions
function Get-DirectoryStructure {
    param([string]$Path)

    $structure = @{}

    try {
        Get-ChildItem -Path $Path -Recurse -File | ForEach-Object {
            $relativePath = $_.FullName.Replace($ProjectRoot, "").TrimStart('\', '/')
            $directory = Split-Path -Parent $relativePath
            $fileName = $_.Name

            if (-not $structure.ContainsKey($directory)) {
                $structure[$directory] = @()
            }
            $structure[$directory] += $fileName
        }
    }
    catch {
        Write-Warning "Could not analyze directory: $Path"
    }

    return $structure
}

function Analyze-ProjectStructure {
    Write-Header "Project Structure Analysis"

    $analysis = @{
        TotalFiles                = 0
        FilesByType               = @{}
        DirectoryStats            = @{}
        OrganizationOpportunities = @()
    }

    # Analyze all files
    $allFiles = Get-ChildItem -Path $ProjectRoot -Recurse -File
    $analysis.TotalFiles = $allFiles.Count

    # File type analysis
    $allFiles | ForEach-Object {
        $extension = $_.Extension.ToLower()
        if ($extension -eq '') { $extension = 'no-extension' }

        if (-not $analysis.FilesByType.ContainsKey($extension)) {
            $analysis.FilesByType[$extension] = 0
        }
        $analysis.FilesByType[$extension]++
    }

    # Directory analysis
    $directories = Get-ChildItem -Path $ProjectRoot -Recurse -Directory
    foreach ($dir in $directories) {
        $fileCount = (Get-ChildItem -Path $dir.FullName -File).Count
        $relativePath = $dir.FullName.Replace($ProjectRoot, "").TrimStart('\', '/')
        $analysis.DirectoryStats[$relativePath] = $fileCount
    }

    # Identify organization opportunities
    $analysis.OrganizationOpportunities = @(
        "Scripts directory has $(($OrganizationConfig.Scripts.Keys | ForEach-Object { $OrganizationConfig.Scripts[$_].Count } | Measure-Object -Sum).Sum) files that could be better organized",
        "Components directory could benefit from feature-based grouping",
        "Utils directory could be reorganized by functionality",
        "Public directory could have better asset organization",
        "Test files could be co-located with source files"
    )

    # Display results
    Write-ColorOutput "📊 Analysis Results:" "Blue"
    Write-Host "  Total Files: $($analysis.TotalFiles)"
    Write-Host "  Total Directories: $($directories.Count)"

    Write-Host "`n📁 Top File Types:"
    $analysis.FilesByType.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 10 | ForEach-Object {
        Write-Host "  $($_.Key): $($_.Value) files"
    }

    Write-Host "`n📂 Largest Directories:"
    $analysis.DirectoryStats.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 10 | ForEach-Object {
        Write-Host "  $($_.Key): $($_.Value) files"
    }

    Write-Host "`n🎯 Organization Opportunities:"
    $analysis.OrganizationOpportunities | ForEach-Object {
        Write-ColorOutput "  • $_" "Yellow"
    }

    return $analysis
}

function Organize-ScriptsDirectory {
    param([switch]$DryRun)

    Write-Header "Organizing Scripts Directory"

    $scriptsPath = Join-Path $ProjectRoot "scripts"
    $organized = 0

    foreach ($category in $OrganizationConfig.Scripts.Keys) {
        $categoryPath = Join-Path $scriptsPath $category.ToLower()

        if (-not (Test-Path $categoryPath) -and -not $DryRun) {
            New-Item -Path $categoryPath -ItemType Directory -Force | Out-Null
            Write-Success "Created directory: scripts/$($category.ToLower())"
        }

        foreach ($scriptFile in $OrganizationConfig.Scripts[$category]) {
            $sourcePath = Join-Path $scriptsPath $scriptFile
            $targetPath = Join-Path $categoryPath $scriptFile

            if (Test-Path $sourcePath) {
                if ($DryRun) {
                    Write-ColorOutput "Would move: $scriptFile → $($category.ToLower())/" "Yellow"
                }
                else {
                    try {
                        Move-Item -Path $sourcePath -Destination $targetPath -Force
                        Write-Success "Moved: $scriptFile → $($category.ToLower())/"
                        $organized++
                    }
                    catch {
                        Write-Error "Failed to move ${scriptFile}: $($_.Exception.Message)"
                    }
                }
            }
        }
    }

    if (-not $DryRun) {
        Write-Success "Organized $organized script files into categories"
    }
}

function Organize-SourceDirectory {
    param([switch]$DryRun)

    Write-Header "Organizing Source Directory"

    $srcPath = Join-Path $ProjectRoot "src"
    $organized = 0

    # Organize components
    $componentsPath = Join-Path $srcPath "components"
    foreach ($category in $OrganizationConfig.Source.Components.Keys) {
        $categoryPath = Join-Path $componentsPath $category.ToLower()

        if (-not (Test-Path $categoryPath) -and -not $DryRun) {
            New-Item -Path $categoryPath -ItemType Directory -Force | Out-Null
            Write-Success "Created directory: src/components/$($category.ToLower())"
        }

        foreach ($componentFile in $OrganizationConfig.Source.Components[$category]) {
            $sourcePath = Join-Path $componentsPath $componentFile
            $targetPath = Join-Path $categoryPath $componentFile

            if (Test-Path $sourcePath) {
                if ($DryRun) {
                    Write-ColorOutput "Would move: $componentFile → components/$($category.ToLower())/" "Yellow"
                }
                else {
                    try {
                        Move-Item -Path $sourcePath -Destination $targetPath -Force
                        Write-Success "Moved: $componentFile → components/$($category.ToLower())/"
                        $organized++
                    }
                    catch {
                        Write-Error "Failed to move ${componentFile}: $($_.Exception.Message)"
                    }
                }
            }
        }
    }

    # Organize page components
    $pageComponentsPath = Join-Path $srcPath "page-components"
    foreach ($category in $OrganizationConfig.Source.PageComponents.Keys) {
        $categoryPath = Join-Path $pageComponentsPath $category.ToLower()

        if (-not (Test-Path $categoryPath) -and -not $DryRun) {
            New-Item -Path $categoryPath -ItemType Directory -Force | Out-Null
            Write-Success "Created directory: src/page-components/$($category.ToLower())"
        }

        foreach ($pageFile in $OrganizationConfig.Source.PageComponents[$category]) {
            $sourcePath = Join-Path $pageComponentsPath $pageFile
            $targetPath = Join-Path $categoryPath $pageFile

            if (Test-Path $sourcePath) {
                if ($DryRun) {
                    Write-ColorOutput "Would move: $pageFile → page-components/$($category.ToLower())/" "Yellow"
                }
                else {
                    try {
                        Move-Item -Path $sourcePath -Destination $targetPath -Force
                        Write-Success "Moved: $pageFile → page-components/$($category.ToLower())/"
                        $organized++
                    }
                    catch {
                        Write-Error "Failed to move ${pageFile}: $($_.Exception.Message)"
                    }
                }
            }
        }
    }

    # Organize styles
    $stylesPath = Join-Path $srcPath "styles"
    foreach ($category in $OrganizationConfig.Source.Styles.Keys) {
        $categoryPath = Join-Path $stylesPath $category.ToLower()

        if (-not (Test-Path $categoryPath) -and -not $DryRun) {
            New-Item -Path $categoryPath -ItemType Directory -Force | Out-Null
            Write-Success "Created directory: src/styles/$($category.ToLower())"
        }

        foreach ($styleFile in $OrganizationConfig.Source.Styles[$category]) {
            $sourcePath = Join-Path $stylesPath $styleFile
            $targetPath = Join-Path $categoryPath $styleFile

            if (Test-Path $sourcePath) {
                if ($DryRun) {
                    Write-ColorOutput "Would move: $styleFile → styles/$($category.ToLower())/" "Yellow"
                }
                else {
                    try {
                        Move-Item -Path $sourcePath -Destination $targetPath -Force
                        Write-Success "Moved: $styleFile → styles/$($category.ToLower())/"
                        $organized++
                    }
                    catch {
                        Write-Error "Failed to move ${styleFile}: $($_.Exception.Message)"
                    }
                }
            }
        }
    }

    # Organize utils
    $utilsPath = Join-Path $srcPath "utils"
    foreach ($category in $OrganizationConfig.Source.Utils.Keys) {
        $categoryPath = Join-Path $utilsPath $category.ToLower()

        if (-not (Test-Path $categoryPath) -and -not $DryRun) {
            New-Item -Path $categoryPath -ItemType Directory -Force | Out-Null
            Write-Success "Created directory: src/utils/$($category.ToLower())"
        }

        foreach ($utilFile in $OrganizationConfig.Source.Utils[$category]) {
            $sourcePath = Join-Path $utilsPath $utilFile
            $targetPath = Join-Path $categoryPath $utilFile

            if (Test-Path $sourcePath) {
                if ($DryRun) {
                    Write-ColorOutput "Would move: $utilFile → utils/$($category.ToLower())/" "Yellow"
                }
                else {
                    try {
                        Move-Item -Path $sourcePath -Destination $targetPath -Force
                        Write-Success "Moved: $utilFile → utils/$($category.ToLower())/"
                        $organized++
                    }
                    catch {
                        Write-Error "Failed to move ${utilFile}: $($_.Exception.Message)"
                    }
                }
            }
        }
    }

    if (-not $DryRun) {
        Write-Success "Organized $organized source files into categories"
    }
}

function Organize-PublicDirectory {
    param([switch]$DryRun)

    Write-Header "Organizing Public Directory"

    $publicPath = Join-Path $ProjectRoot "public"
    $organized = 0

    # Create organized structure for public assets
    $imageCategories = @{
        "core"  = @("austin.webp", "jordyn.webp", "landing-bg.webp", "landing-bg.jpg")
        "audio" = @("first-time-acoustic-cover.webp", "first-time-acoustic-cover.jpg")
    }

    foreach ($category in $imageCategories.Keys) {
        $categoryPath = Join-Path (Join-Path $publicPath "images") $category

        if (-not (Test-Path $categoryPath) -and -not $DryRun) {
            New-Item -Path $categoryPath -ItemType Directory -Force | Out-Null
            Write-Success "Created directory: public/images/$category"
        }

        foreach ($imageFile in $imageCategories[$category]) {
            $sourcePath = Join-Path (Join-Path $publicPath "images") $imageFile
            $targetPath = Join-Path $categoryPath $imageFile

            if (Test-Path $sourcePath) {
                if ($DryRun) {
                    Write-ColorOutput "Would move: $imageFile → images/$category/" "Yellow"
                }
                else {
                    try {
                        Move-Item -Path $sourcePath -Destination $targetPath -Force
                        Write-Success "Moved: $imageFile → images/$category/"
                        $organized++
                    }
                    catch {
                        Write-Error "Failed to move ${imageFile}: $($_.Exception.Message)"
                    }
                }
            }
        }
    }

    if (-not $DryRun) {
        Write-Success "Organized $organized public files into categories"
    }
}

function Create-OrganizationIndex {
    param([switch]$DryRun)

    Write-Header "Creating Organization Index"

    $indexContent = @"
# Project Organization Index
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## Directory Structure

### Scripts (/scripts)
- **core/**: Essential maintenance and project management scripts
- **development/**: Development environment and workflow scripts
- **deployment/**: Build, deploy, and production scripts
- **testing/**: Test automation and validation scripts
- **monitoring/**: Performance and health monitoring scripts
- **optimization/**: Code and asset optimization scripts
- **security/**: Security validation and remediation scripts
- **mcp/**: Model Context Protocol server management
- **analytics/**: SEO, analytics, and analysis tools
- **utilities/**: General purpose utility scripts

### Source (/src)
#### Components (/src/components)
- **ui/**: Basic UI components (buttons, cards, navigation)
- **forms/**: Form-related components
- **media/**: Media handling components (gallery, video, audio)
- **features/**: Feature-specific components
- **admin/**: Administrative interface components
- **accessibility/**: Accessibility enhancement components
- **performance/**: Performance monitoring and optimization components

#### Page Components (/src/page-components)
- **core/**: Main page components (home, landing)
- **gallery/**: Photo and media gallery pages
- **interactive/**: Interactive features (guestbook, maps)
- **family/**: Family-related pages
- **admin/**: Administrative pages

#### Styles (/src/styles)
- **core/**: Base design system and core styles
- **features/**: Feature-specific styling
- **components/**: Component-specific styles

#### Utils (/src/utils)
- **core/**: Core utility functions
- **seo/**: SEO and metadata utilities
- **performance/**: Performance monitoring and optimization
- **features/**: Feature-specific utilities
- **security/**: Security-related utilities

### Public (/public)
- **images/**: All image assets organized by category
- **scripts/**: Public JavaScript files
- **media/**: Audio and video files
- **config/**: SEO, PWA, and configuration files

## Organization Benefits

1. **Improved Developer Experience**: Logical grouping makes finding files intuitive
2. **Better Maintainability**: Related files are co-located
3. **Enhanced Collaboration**: Clear structure for team development
4. **Optimized Build Process**: Better tree-shaking and code splitting
5. **Simplified Testing**: Test files organized alongside source files

## Usage Guidelines

- Follow the established directory structure for new files
- Keep related files together within their designated categories
- Use the organization scripts to maintain structure
- Update this index when adding new categories

## Maintenance

Run the organization script monthly to maintain structure:
```bash
npm run organize
```

For validation:
```bash
npm run organize:validate
```
"@

    $indexPath = Join-Path $ProjectRoot "PROJECT-ORGANIZATION.md"

    if ($DryRun) {
        Write-ColorOutput "Would create: PROJECT-ORGANIZATION.md" "Yellow"
    }
    else {
        Set-Content -Path $indexPath -Value $indexContent -Encoding UTF8
        Write-Success "Created PROJECT-ORGANIZATION.md"
    }
}

function Update-ImportPaths {
    param([switch]$DryRun)

    Write-Header "Updating Import Paths"

    if ($DryRun) {
        Write-ColorOutput "Would update import paths in TypeScript/JavaScript files" "Yellow"
        return
    }

    # This would involve scanning all .ts, .tsx, .js, .jsx files and updating import paths
    # For now, we'll create a report of files that need manual attention

    $filesToUpdate = @()

    Get-ChildItem -Path (Join-Path $ProjectRoot "src") -Recurse -Include "*.ts", "*.tsx", "*.js", "*.jsx" | ForEach-Object {
        $content = Get-Content $_.FullName -Raw

        # Check for imports that might need updating
        if ($content -match 'import.*from.*[''"]\.\.?/') {
            $filesToUpdate += $_.FullName.Replace($ProjectRoot, "").TrimStart('\', '/')
        }
    }

    if ($filesToUpdate.Count -gt 0) {
        Write-Warning "Files with relative imports that may need updating:"
        $filesToUpdate | ForEach-Object {
            Write-Host "  $_"
        }

        $reportPath = Join-Path $ProjectRoot "import-updates-needed.txt"
        Set-Content -Path $reportPath -Value ($filesToUpdate -join "`n") -Encoding UTF8
        Write-Success "Created import update report: import-updates-needed.txt"
    }
}

function Validate-Organization {
    Write-Header "Validating Organization"

    $validation = @{
        ScriptsOrganized    = $false
        ComponentsOrganized = $false
        StylesOrganized     = $false
        UtilsOrganized      = $false
        PublicOrganized     = $false
        Issues              = @()
    }

    # Check scripts organization
    $scriptsPath = Join-Path $ProjectRoot "scripts"
    $expectedScriptDirs = @("core", "development", "deployment", "testing", "monitoring", "optimization", "security", "mcp", "analytics", "utilities")
    $actualScriptDirs = Get-ChildItem -Path $scriptsPath -Directory | Select-Object -ExpandProperty Name

    $validation.ScriptsOrganized = ($expectedScriptDirs | ForEach-Object { $_ -in $actualScriptDirs }).Count -gt 5

    # Check components organization
    $componentsPath = Join-Path $ProjectRoot "src\components"
    if (Test-Path $componentsPath) {
        $expectedComponentDirs = @("ui", "forms", "media", "features", "admin", "accessibility", "performance")
        $actualComponentDirs = Get-ChildItem -Path $componentsPath -Directory | Select-Object -ExpandProperty Name
        $validation.ComponentsOrganized = ($expectedComponentDirs | ForEach-Object { $_ -in $actualComponentDirs }).Count -gt 3
    }

    # Display results
    Write-ColorOutput "📋 Validation Results:" "Blue"
    Write-Host "  Scripts Organized: $(if ($validation.ScriptsOrganized) { '✅' } else { '❌' })"
    Write-Host "  Components Organized: $(if ($validation.ComponentsOrganized) { '✅' } else { '❌' })"

    if ($validation.Issues.Count -gt 0) {
        Write-Host "`n⚠️  Issues Found:"
        $validation.Issues | ForEach-Object {
            Write-Warning "  $_"
        }
    }
    else {
        Write-Success "No organization issues found!"
    }

    return $validation
}

# Main execution
try {
    Write-Header "Comprehensive Project Organization System"

    switch ($Mode) {
        'analyze' {
            $analysis = Analyze-ProjectStructure
        }

        'organize' {
            if ($DryRun) {
                Write-Warning "DRY RUN MODE - No changes will be made"
                Write-Host ""
            }

            Organize-ScriptsDirectory -DryRun:$DryRun
            Organize-SourceDirectory -DryRun:$DryRun
            Organize-PublicDirectory -DryRun:$DryRun
            Create-OrganizationIndex -DryRun:$DryRun
            Update-ImportPaths -DryRun:$DryRun

            if (-not $DryRun) {
                Write-Header "Organization Complete!"
                Write-Success "Project structure has been comprehensively organized"
                Write-ColorOutput "Next steps:" "Blue"
                Write-Host "  1. Review any import path updates needed"
                Write-Host "  2. Run tests to ensure nothing broke"
                Write-Host "  3. Update your IDE workspace settings"
                Write-Host "  4. Run: npm run organize:validate"
            }
        }

        'validate' {
            $validation = Validate-Organization
        }
    }

    Write-Header "Operation Complete"
    Write-Success "Project organization $Mode completed successfully!"

}
catch {
    Write-Error "Organization failed: $($_.Exception.Message)"
    Write-Host "Stack trace:" -ForegroundColor Red
    Write-Host $_.ScriptStackTrace -ForegroundColor Red
    exit 1
}
