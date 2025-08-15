# Fix Pylance MCP Server Connection Error - Complete Resolution

## Issue Identified

VS Code is attempting to connect to a Pylance MCP server on port 5188 due to **global VS Code user settings** that enable MCP integration, even though we've disabled it at the workspace level.

## Root Cause

The global VS Code settings file contains:

```json
"chat.mcp.serverSampling": {
  "pylance mcp server: pylance mcp server": {
    "allowedModels": [
      "github.copilot-chat/gpt-4.1",
      "github.copilot-chat/claude-3.5-sonnet"
    ]
  }
}
```

This global setting overrides workspace-level disabling of Pylance MCP.

## Complete Solution

### Step 1: Disable Global Pylance MCP Settings

We need to modify your global VS Code user settings to disable Pylance MCP integration completely.

### Step 2: Enhanced Workspace Configuration

Your workspace settings have been updated with comprehensive Pylance MCP disabling.

### Step 3: Restart VS Code

After making these changes, VS Code needs to be restarted to clear all cached extension configurations.

## Implementation

Run the following PowerShell script to automatically fix the global settings:
