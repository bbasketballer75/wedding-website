param(
    [string]$selectedText,
    [string]$languageId,
    [string]$contextFile = "$PSScriptRoot\..\.copilot_context.txt"
)

# Load context if available
$context = if (Test-Path $contextFile) { Get-Content $contextFile -Raw } else { "" }

$analysisPrompt = @"
Analyze this $languageId code for improvements.
Project Context: $context
Code to analyze: $selectedText
Respond with specific optimizations for Windows 11 development.
"@

$claudeResponse = & "$PSScriptRoot\claude-api.ps1" -prompt $analysisPrompt

# Format for Copilot
"`n### Claude Analysis ###`n$claudeResponse`n`n### Original Code ###`n$selectedText"