# MCP Filesystem Configuration for Wedding Website Project

## Recommended Allowed Directories

Add these paths to your MCP filesystem server configuration to give AI assistants comprehensive access to your project and development environment:

### 🏠 Core Project Access

```json
{
  "allowedDirectories": [
    // Main Project Directory
    "C:/Users/Austin/Downloads/wedding-website",

    // Project Backend
    "C:/Users/Austin/Downloads/wedding-website/backend",

    // Project Documentation & Scripts
    "C:/Users/Austin/Downloads/wedding-website/docs",
    "C:/Users/Austin/Downloads/wedding-website/scripts",
    "C:/Users/Austin/Downloads/wedding-website/.vscode",

    // Build Outputs (for debugging)
    "C:/Users/Austin/Downloads/wedding-website/.next",
    "C:/Users/Austin/Downloads/wedding-website/dist",
    "C:/Users/Austin/Downloads/wedding-website/out",

    // VS Code Extensions & Settings
    "C:/Users/Austin/.vscode/extensions",
    "C:/Users/Austin/AppData/Roaming/Code/User",

    // Development Tools & MCP Servers
    "C:/Users/Austin/Documents/GitHub/servers",
    "C:/Users/Austin/Documents/GitHub/mongodb-mcp-server",

    // Node.js Global Modules (for troubleshooting)
    "C:/Users/Austin/AppData/Roaming/npm",

    // Temporary Development Files
    "C:/temp",
    "C:/Users/Austin/AppData/Local/Temp"
  ]
}
```

### 🔧 Development Environment Access

```json
{
  "additionalPaths": [
    // Git Configuration
    "C:/Users/Austin/.gitconfig",
    "C:/Users/Austin/.git-credentials",

    // SSH Keys (for deployment troubleshooting)
    "C:/Users/Austin/.ssh",

    // Environment Variables & Configs
    "C:/Users/Austin/.env",
    "C:/Users/Austin/.bashrc",
    "C:/Users/Austin/.profile",

    // PowerShell Profile
    "C:/Users/Austin/Documents/PowerShell",

    // Package Manager Configs
    "C:/Users/Austin/.npmrc",
    "C:/Users/Austin/.yarnrc",
    "C:/Users/Austin/package.json"
  ]
}
```

### 🌐 Deployment & Production Access

```json
{
  "deploymentPaths": [
    // Vercel Local Config
    "C:/Users/Austin/.vercel",

    // Vercel Local Config
    "C:/Users/Austin/.vercel",

    // Firebase Local Config
    "C:/Users/Austin/.firebase",

    // Google Cloud SDK
    "C:/Users/Austin/AppData/Roaming/gcloud",

    // Certificate Storage
    "C:/Users/Austin/.local/share/mkcert"
  ]
}
```

## Configuration Instructions

### Option 1: Update VS Code Settings

Add to your `.vscode/settings.json`:

```json
{
  "mcp.filesystem.allowedDirectories": [
    "C:/Users/Austin/Downloads/wedding-website",
    "C:/Users/Austin/Documents/GitHub/servers",
    "C:/Users/Austin/Documents/GitHub/mongodb-mcp-server",
    "C:/Users/Austin/.vscode/extensions",
    "C:/Users/Austin/AppData/Roaming/Code/User",
    "C:/Users/Austin/AppData/Roaming/npm",
    "C:/Users/Austin/.ssh",
    "C:/Users/Austin/.vercel",
    "C:/Users/Austin/.vercel",
    "C:/Users/Austin/.firebase",
    "C:/temp"
  ],
  "mcp.filesystem.recursiveAccess": true,
  "mcp.filesystem.followSymlinks": true
}
```

### Option 2: Update MCP Server Configuration

Create or update `C:/Users/Austin/Documents/GitHub/servers/src/filesystem/config.json`:

```json
{
  "name": "filesystem",
  "command": "node",
  "args": ["dist/index.js"],
  "allowedDirectories": [
    "C:/Users/Austin/Downloads/wedding-website",
    "C:/Users/Austin/Documents/GitHub/servers",
    "C:/Users/Austin/Documents/GitHub/mongodb-mcp-server",
    "C:/Users/Austin/.vscode/extensions",
    "C:/Users/Austin/AppData/Roaming/Code/User",
    "C:/Users/Austin/AppData/Roaming/npm",
    "C:/temp"
  ]
}
```

### Option 3: Environment Variable (Recommended)

Set a Windows environment variable:

```powershell
$env:MCP_FILESYSTEM_ALLOWED_DIRS = "C:/Users/Austin/Downloads/wedding-website;C:/Users/Austin/Documents/GitHub/servers;C:/Users/Austin/Documents/GitHub/mongodb-mcp-server;C:/Users/Austin/.vscode/extensions;C:/Users/Austin/AppData/Roaming/Code/User;C:/temp"
```

## Benefits of This Configuration

### ✅ What This Enables

1. **Full Project Access**: Complete read/write access to your wedding website codebase
2. **Extension Management**: Can analyze and troubleshoot VS Code extensions
3. **MCP Server Integration**: Access to all your MCP servers for enhanced capabilities
4. **Development Tools**: Can examine Node.js global packages and configs
5. **Deployment Debugging**: Access to Vercel, Firebase configs
6. **Git Integration**: Can read Git configuration and SSH keys for deployment issues
7. **Build Debugging**: Access to build outputs and temporary files
8. **Configuration Files**: Can read and modify all development configuration files

### 🔒 Security Considerations

- **SSH Keys**: Only grant if you need deployment troubleshooting
- **Environment Variables**: Consider using project-specific .env files instead
- **Temporary Directories**: Useful for debugging but can be excluded if concerned
- **User Directories**: Consider limiting to specific subdirectories

### 🎯 Project-Specific Benefits

For your wedding website project, this configuration enables:

- **Code Analysis**: Full access to frontend, backend, and configuration files
- **Deployment Support**: Can troubleshoot Vercel deployments and environment variables
- **Database Integration**: Access to Firebase/Firestore configuration files
- **Image Optimization**: Can analyze and optimize photo gallery assets
- **Performance Monitoring**: Access to build outputs for bundle analysis
- **Testing Support**: Can run and analyze test outputs
- **Documentation**: Can maintain and update project documentation

## Next Steps

1. Choose your preferred configuration method (Option 1, 2, or 3)
2. Restart VS Code after making changes
3. Test MCP filesystem access with a simple file operation
4. Verify all paths are accessible and working correctly

## Troubleshooting

If paths don't work:

- Ensure all directories exist
- Check Windows path permissions
- Verify MCP filesystem server is running
- Check VS Code extension logs for errors
- Try using forward slashes (/) instead of backslashes (\) in paths
