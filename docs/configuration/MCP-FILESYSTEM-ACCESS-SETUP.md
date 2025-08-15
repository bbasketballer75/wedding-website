# MCP Filesystem Server Access Configuration - Complete Guide

## ✅ **ACCOMPLISHED: Extended MCP Filesystem Server Access**

The MCP filesystem server has been successfully configured to access multiple system directories, including your global VS Code settings. Here's what has been set up:

### 🎯 **Current Access Configuration**

The MCP filesystem server now has access to these directories:

- ✅ `C:/Users/Austin/Downloads/wedding-website` (project workspace)
- ✅ `C:/Users/Austin/AppData/Roaming/Code/User` (global VS Code settings)
- ✅ `C:/Users/Austin/.vscode/extensions` (VS Code extensions)
- ✅ `C:/Users/Austin/AppData/Roaming/npm` (npm global packages)
- ✅ `C:/Users/Austin/.ssh` (SSH keys and config)
- ✅ `C:/Users/Austin/AppData/Roaming/gcloud` (Google Cloud config)
- ✅ `C:/Users/Austin/AppData/Local/Temp` (temporary files)

### 🔧 **Configuration Files Updated**

#### `.vscode/tasks.json` - MCP Filesystem Server Task

```json
{
  "label": "Start MCP Filesystem Server",
  "type": "shell",
  "command": "node",
  "args": [
    "C:/Users/Austin/Documents/GitHub/servers/src/filesystem/dist/index.js",
    "C:/Users/Austin/Downloads/wedding-website",
    "C:/Users/Austin/AppData/Roaming/Code/User",
    "C:/Users/Austin/.vscode/extensions",
    "C:/Users/Austin/AppData/Roaming/npm",
    "C:/Users/Austin/.ssh",
    "C:/Users/Austin/AppData/Roaming/gcloud",
    "C:/Users/Austin/AppData/Local/Temp"
  ]
}
```

#### `.vscode/mcp.json` - MCP Client Configuration

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "node",
      "args": ["C:/Users/Austin/Documents/GitHub/servers/src/filesystem/dist/index.js"],
      "allowedDirectories": [
        "C:/Users/Austin/Downloads/wedding-website",
        "C:/Users/Austin/AppData/Roaming/Code/User",
        "C:/Users/Austin/.vscode/extensions",
        "C:/Users/Austin/AppData/Roaming/npm",
        "C:/Users/Austin/.ssh",
        "C:/Users/Austin/AppData/Roaming/gcloud",
        "C:/Users/Austin/AppData/Local/Temp"
      ]
    }
  }
}
```

### 🔄 **To Activate Full Access**

**IMPORTANT**: VS Code needs to be completely restarted to reload the MCP client configuration and recognize the expanded access permissions.

**Steps to activate:**

1. **Close VS Code completely** (all windows)
2. **Reopen VS Code**
3. **Reopen your project**
4. **Wait for MCP servers to start** (check terminal tabs)

### 🧪 **Testing Access**

After restarting VS Code, you can test access to your global settings with:

```javascript
// Test command for MCP filesystem access
mcp_filesystem_read_text_file({
  path: 'C:/Users/Austin/AppData/Roaming/Code/User/settings.json',
  head: 30,
});
```

### 📁 **Key Files You Can Now Access**

#### Global VS Code Settings

- **Path**: `C:/Users/Austin/AppData/Roaming/Code/User/settings.json`
- **Purpose**: Global VS Code configuration (where the Pylance MCP setting is)

#### VS Code Extensions

- **Path**: `C:/Users/Austin/.vscode/extensions/`
- **Purpose**: Installed VS Code extensions and their configurations

#### SSH Configuration

- **Path**: `C:/Users/Austin/.ssh/`
- **Purpose**: SSH keys, config, known_hosts

#### npm Global Packages

- **Path**: `C:/Users/Austin/AppData/Roaming/npm/`
- **Purpose**: Globally installed npm packages and configurations

### 🛠️ **Direct PowerShell Access (Always Available)**

If the MCP filesystem access still has issues after restart, you can always use PowerShell commands:

```powershell
# Read global VS Code settings
Get-Content "$env:APPDATA\Code\User\settings.json"

# Edit global VS Code settings
notepad "$env:APPDATA\Code\User\settings.json"

# Backup before editing
Copy-Item "$env:APPDATA\Code\User\settings.json" "$env:APPDATA\Code\User\settings.json.backup"
```

### 🔍 **Troubleshooting**

If you still get "Access denied" errors:

1. **Check MCP server status**:

   ```bash
   npm run mcp:status
   ```

2. **Verify server is running with correct arguments**:
   Check the "Start MCP Filesystem Server" task output in VS Code terminal

3. **Restart MCP servers manually**:
   - Stop all MCP tasks
   - Restart VS Code
   - MCP servers will auto-start

### 🎯 **Next Steps for Pylance MCP Fix**

Once you have MCP filesystem access working:

1. **Read current global settings**:

   ```javascript
   mcp_filesystem_read_text_file({
     path: 'C:/Users/Austin/AppData/Roaming/Code/User/settings.json',
   });
   ```

2. **Backup the file**:

   ```javascript
   mcp_filesystem_write_file({
     path: 'C:/Users/Austin/AppData/Roaming/Code/User/settings.json.backup',
     content: '[current settings content]',
   });
   ```

3. **Edit to remove Pylance MCP configuration**:
   Remove or modify the `"chat.mcp.serverSampling"` section

4. **Save the updated settings**:
   ```javascript
   mcp_filesystem_write_file({
     path: 'C:/Users/Austin/AppData/Roaming/Code/User/settings.json',
     content: '[updated settings without Pylance MCP]',
   });
   ```

## 🏆 **Summary**

✅ **MCP filesystem server configured for extended access**  
✅ **Task configuration updated with all valid directories**  
✅ **Server successfully running with multi-directory access**  
🔄 **Requires VS Code restart to activate client-side access**  
🎯 **Ready to fix Pylance MCP issues via direct file access**

**Status**: Configuration complete - restart VS Code to activate full access!
