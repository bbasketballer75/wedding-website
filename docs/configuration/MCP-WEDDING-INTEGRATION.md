# Wedding Website MCP Integration

## Overview

This wedding website now includes **Model Context Protocol (MCP)** servers that provide AI-powered tools for managing wedding content and photos. These tools integrate seamlessly with VS Code and GitHub Copilot Chat to enhance your wedding website development workflow.

## 🚀 MCP Servers

### 1. Wedding Photos Server (`wedding-photos-server.ts`)

**Purpose**: Manages wedding photo collections with intelligent categorization and optimization.

**Available Tools**:

- `analyze_photo` - Extract metadata and analyze individual photos
- `categorize_photos` - Automatically sort photos into wedding categories
- `generate_gallery_config` - Create gallery configurations for different photo types
- `optimize_photos` - Optimize photos for web display with quality settings
- `create_photo_manifest` - Generate a comprehensive photo inventory

**Categories Supported**:

- Engagement photos
- Ceremony moments
- Reception celebration
- Portrait gallery
- Candid moments
- Wedding details
- Family & friends
- Venue & location

### 2. Wedding Content Server (`wedding-content-server.ts`)

**Purpose**: Manages guest stories, guestbook entries, and wedding timeline content.

**Available Tools**:

- `moderate_guest_stories` - Review and approve guest story submissions
- `analyze_guest_sentiment` - Analyze emotional themes in guest content
- `generate_content_report` - Create comprehensive content analytics
- `create_timeline_event` - Add new events to wedding timeline
- `backup_content` - Create complete content backups

## 📋 Setup & Configuration

### 1. Installation Complete ✅

```bash
npm install @modelcontextprotocol/sdk
npm install -D tsx
```

### 2. MCP Servers Configured ✅

- `mcp-servers/wedding-photos-server.ts`
- `mcp-servers/wedding-content-server.ts`
- `.mcp-config.json` created

### 3. VS Code Integration ✅

- MCP autodiscovery enabled: `"chat.mcp.discovery": { "enabled": true }`
- Servers will be automatically detected by VS Code

## 🛠️ Usage Examples

### Using MCP Tools in VS Code Chat

Once the servers are running, you can use these tools directly in GitHub Copilot Chat:

**Photo Management**:

```
@mcp analyze_photo {"filename": "ceremony-001.jpg"}
@mcp categorize_photos {"directory": "./public/photos/new"}
@mcp generate_gallery_config {"category": "ceremony"}
```

**Content Management**:

```
@mcp moderate_guest_stories {"action": "list"}
@mcp analyze_guest_sentiment {"type": "all"}
@mcp generate_content_report {"timeframe": "month"}
```

### Running MCP Servers

**Start individual servers**:

```bash
npm run mcp:photos    # Wedding photos server
npm run mcp:content   # Wedding content server
```

**Test server availability**:

```bash
npm run mcp:test
```

## 🎯 Practical Wedding Website Use Cases

### 1. **Photo Organization Workflow**

1. Upload new wedding photos to `/public/photos/`
2. Run `categorize_photos` to auto-sort by category
3. Use `analyze_photo` to extract metadata for SEO
4. Generate optimized gallery configs with `generate_gallery_config`

### 2. **Guest Content Moderation**

1. Use `moderate_guest_stories` to review submissions
2. Analyze sentiment with `analyze_guest_sentiment`
3. Feature the best stories for homepage display
4. Generate monthly reports for family updates

### 3. **Timeline Management**

1. Create milestone events with `create_timeline_event`
2. Categorize by relationship phases (dating → engagement → wedding)
3. Auto-generate timeline displays for the website

### 4. **Content Backup & Analytics**

1. Regular backups with `backup_content`
2. Track engagement with `generate_content_report`
3. Monitor guest sentiment and themes

## 🔧 Advanced Configuration

### Custom Photo Categories

Edit `wedding-photos-server.ts` to add custom categories:

```typescript
const PHOTO_CATEGORIES = [
  'engagement',
  'ceremony',
  'reception',
  // Add your custom categories here
  'pre-wedding',
  'honeymoon',
] as const;
```

### Content Moderation Rules

Customize moderation logic in `wedding-content-server.ts`:

```typescript
private async moderateGuestStories(action: string, storyId?: string) {
  // Add custom moderation rules
  // Auto-approve trusted users
  // Flag suspicious content
}
```

## 📊 Integration with Wedding Website Features

### Memory Vault Integration

The MCP photo tools integrate directly with your Memory Vault page:

- Auto-categorization feeds into vault organization
- Metadata extraction enhances search functionality
- Optimization tools ensure fast loading

### Guest Stories Enhancement

Content tools enhance the guest stories experience:

- Sentiment analysis for emotional insights
- Auto-moderation reduces manual review time
- Analytics help understand guest engagement

### Admin Dashboard Data

MCP servers provide data for admin dashboards:

- Photo upload statistics
- Content moderation queues
- Guest engagement metrics

## 🚨 Security & Privacy

- **Content Moderation**: All guest submissions go through moderation tools
- **Backup Security**: Content backups include sensitive guest data - store securely
- **API Access**: MCP servers run locally and don't expose external APIs
- **Guest Privacy**: Sentiment analysis is performed locally, no data sent to external services

## 🔄 Next Steps

1. **Test the MCP Integration**: Try the tools in VS Code Chat
2. **Customize Categories**: Add wedding-specific photo/content categories
3. **Automate Workflows**: Set up automated photo processing and content moderation
4. **Monitor Analytics**: Use reporting tools to track guest engagement
5. **Backup Strategy**: Implement regular content backups before the wedding

## 💡 Pro Tips

- Use MCP tools during development to quickly organize test content
- Set up automated photo processing for wedding day uploads
- Create content moderation workflows for guest story management
- Use analytics to understand which content resonates with guests
- Backup everything before major website updates

---

Your wedding website now has enterprise-level content management capabilities powered by MCP! 🎉
