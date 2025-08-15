<#
.SYNOPSIS
  Claude 4 API Integration Script for VS Code
.DESCRIPTION
  Handles communication with Claude 4 API, optimized for Windows 11 development
#>

param(
    [string]$prompt,
    [string]$contextFile,
    [switch]$verbose = $false
)

#region Configuration
$VERSION = "1.2"
$MAX_RETRIES = 3
$TIMEOUT_SECONDS = 45
#endregion

#region Initialization
if ($verbose) {
    $VerbosePreference = "Continue"
    Write-Verbose "Claude API Script v$VERSION"
    Write-Verbose "Prompt: $($prompt.Substring(0, [Math]::Min($prompt.Length, 100))..."
    Write-Verbose "Context File: $contextFile"
}

# Load API key (priority: env var > config file > prompt)
$apiKey = $env:ANTHROPIC_API_KEY
if (-not $apiKey -and (Test-Path "$PSScriptRoot\anthropic-config.json")) {
    try {
        $config = Get-Content "$PSScriptRoot\anthropic-config.json" -Raw | ConvertFrom-Json
        $apiKey = $config.API_KEY
        if ($verbose) { Write-Verbose "Loaded API key from config file" }
    }
    catch {
        Write-Warning "Failed to read anthropic-config.json: $_"
    }
}

if (-not $apiKey) {
    throw "API key not found. Set ANTHROPIC_API_KEY environment variable or create anthropic-config.json"
}
#endregion

#region Context Processing
$context = ""
if (Test-Path $contextFile) {
    try {
        $context = Get-Content $contextFile -Raw -ErrorAction Stop
        if ($verbose) { Write-Verbose "Loaded $(($context -split '\r\n|\r|\n').Count) lines of context" }
    }
    catch {
        Write-Warning "Failed to load context file: $_"
    }
}

$systemPrompt = @"
You are a senior Windows 11 developer assisting with VS Code projects.
Current project: $($contextFile -replace '.*\\')
Additional Context:
$context

Follow these rules:
1. Always use Windows path format (C:\ instead of /mnt/c/)
2. Prefer PowerShell 7+ over Bash
3. For Linux tools, show WSL2 equivalent
4. Format code blocks with language identifiers
5. Include security considerations for Windows
"@
#endregion

#region API Communication
$retryCount = 0
do {
    try {
        $headers = @{
            "x-api-key" = $apiKey
            "anthropic-version" = "2023-06-01"
            "Content-Type" = "application/json"
        }

        $body = @{
            model = "claude-4-opus"
            max_tokens = [int]($env:MAX_TOKENS ?? 4096)
            system = $systemPrompt
            messages = @(@{
                role = "user"
                content = $prompt
            })
        } | ConvertTo-Json -Depth 5 -Compress

        if ($verbose) {
            Write-Verbose "Sending request to Claude API..."
            Write-Verbose "Body: $($body | ConvertFrom-Json | ConvertTo-Json -Depth 2)"
        }

        $response = Invoke-RestMethod -Uri "https://api.anthropic.com/v1/messages" `
                    -Method Post `
                    -Headers $headers `
                    -Body $body `
                    -TimeoutSec $TIMEOUT_SECONDS

        # Format output
        $result = $response.content[0].text
        $result = $result -replace '```powershell', '```ps1' `
                          -replace '```bash', '```sh' `
                          -replace '```javascript', '```js'

        if ($verbose) { Write-Verbose "Received response: $($result.Substring(0, [Math]::Min($result.Length, 100))..." }
        return $result
    }
    catch {
        $retryCount++
        if ($retryCount -ge $MAX_RETRIES) {
            throw "API request failed after $MAX_RETRIES attempts: $($_.Exception.Message)"
        }
        
        $retryDelay = [Math]::Pow(2, $retryCount) # Exponential backoff
        Write-Warning "Attempt $retryCount failed. Retrying in $retryDelay seconds..."
        Start-Sleep -Seconds $retryDelay
    }
} while ($retryCount -lt $MAX_RETRIES)
#endregion