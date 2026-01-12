# Figma MCP Setup Guide

This guide explains how to set up the **official Figma MCP (Model Context Protocol) server** to enable AI-assisted design token syncing from Figma to the design system.

## What is Figma MCP?

Figma MCP is Figma's official MCP server that allows AI assistants like Claude to directly access your Figma files, styles, variables, and components.

**Official Documentation:** https://developers.figma.com/docs/figma-mcp-server/

## Two Server Options

Figma provides **two MCP server options**:

### 1. Remote Server (Recommended for Teams)

- **URL:** `https://mcp.figma.com/mcp`
- **Authentication:** OAuth (browser-based, one-time setup)
- **Pros:** Works anywhere, no local setup, team-friendly
- **Cons:** Requires internet connection

### 2. Desktop App Server (For Local Development)

- **URL:** `http://127.0.0.1:3845/mcp`
- **Authentication:** Automatic (via Figma desktop app)
- **Pros:** Faster, works offline, no OAuth needed
- **Cons:** Requires Figma desktop app running, local only

**We recommend the Remote Server** for this project to ensure all team members can sync tokens without requiring the desktop app.

## Prerequisites

- Access to the Safe Wallet Figma project
- **Remote Server:** Claude Code or Claude Desktop
- **Desktop Server:** Figma desktop app + Dev Mode enabled

## Setup Methods

Choose based on your preferred server option:

### Option 1: Claude Code (Recommended for this project)

Run this command in your terminal:

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

This will:

1. Add the Figma MCP server to your Claude Code configuration
2. Prompt you to authenticate with Figma OAuth
3. Give Claude access to your Figma files

### Option 2: VS Code with MCP Extension

If you're using the MCP extension directly in VS Code:

1. Create or edit `~/.vscode/mcp.json` (or workspace `.vscode/mcp.json`)
2. Add the Figma server configuration:

```json
{
  "mcpServers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp",
      "type": "http"
    }
  }
}
```

3. Restart VS Code
4. Authenticate with Figma when prompted

### Option 3: Claude Desktop

Add to your Claude Desktop config at `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp",
      "type": "http"
    }
  }
}
```

**After updating the config, restart Claude Desktop.**

### Option 4: Desktop App Server (Alternative)

If you prefer using the Figma desktop app for faster local access:

1. **Enable the server in Figma Desktop:**
   - Open Figma desktop app (update to latest version)
   - Switch to Dev Mode (Shift+D)
   - In the MCP server section of the inspect panel
   - Select "Enable desktop MCP server"
   - Server runs at `http://127.0.0.1:3845/mcp`

2. **Configure your editor:**

   **Claude Code:**

   ```bash
   claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
   ```

   **VS Code:**

   ```json
   {
     "mcpServers": {
       "figma-desktop": {
         "url": "http://127.0.0.1:3845/mcp",
         "type": "http"
       }
     }
   }
   ```

   **Claude Desktop:**

   ```json
   {
     "mcpServers": {
       "figma-desktop": {
         "url": "http://127.0.0.1:3845/mcp",
         "type": "http"
       }
     }
   }
   ```

3. **Keep Figma desktop app running** when using Claude

**Note:** Desktop server requires the Figma app to be open and in Dev Mode. For team collaboration, use the Remote Server instead.

## Authentication

The first time Claude tries to access Figma, you'll be prompted to:

1. **Sign in to Figma** via OAuth
2. **Grant permissions** for Claude to read your Figma files
3. **Authorize** specific files or your entire account

This is a **one-time setup** - the authentication token is stored securely.

## Project Configuration

This design system includes a `.mcp.json` file at the project root:

```json
{
  "mcpServers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp",
      "type": "http"
    }
  }
}
```

This file:

- Documents the required MCP configuration for the team
- Is committed to the repository (no secrets)
- Ensures everyone uses the official Figma MCP server

## Get Your Figma File Key

To sync design tokens, you need your Figma file key:

1. Open your Figma file in the browser
2. The URL looks like: `https://www.figma.com/file/ABC123XYZ/File-Name`
3. The file key is the part after `/file/` (e.g., `ABC123XYZ`)

Save this file key in `figma/sync-manifest.json`:

```json
{
  "figmaFileKey": "YOUR_FILE_KEY_HERE",
  "figmaFileName": "Safe Wallet Design System"
}
```

## Test the Connection

Once configured, test that Claude can access Figma:

1. Open Claude Code in this directory (`packages/design-system/`)
2. Ask Claude: "Can you access Figma? List the available Figma MCP tools."
3. Claude should respond with available Figma operations

## Sync Design Tokens

Once MCP is configured and authenticated, syncing is simple:

```
You: "Sync design tokens from Figma file ABC123XYZ to the design system"
```

Claude will:

1. Connect to Figma via the remote MCP server
2. Fetch color styles, text styles, and variables
3. Generate JSON token files in `src/tokens/`
4. Run transformers to generate Tailwind config and CSS variables
5. Validate tokens with Zod
6. Create a commit with the changes

## Available Figma MCP Operations

The official Figma MCP server provides:

- **Get File**: Fetch entire Figma file structure
- **Get Styles**: Get all local color and text styles
- **Get Variables**: Get Figma variables (colors, numbers, strings, booleans)
- **Get Components**: Get component metadata and properties
- **Get Comments**: Fetch comments and annotations
- **Search Files**: Search across your Figma account

## Figma Naming Conventions

For the sync to work correctly, follow these naming conventions in Figma:

### Colors

```
Primitive/Black              → Base color
Primitive/Green-400          → Base color with scale
Semantic/Primary/Main        → Semantic color (light theme)
Semantic/Primary/Dark        → Semantic color (dark theme)
```

### Text Styles

```
Heading/Large/Bold           → Typography style
Body/Medium/Regular          → Typography style
Caption/Small/SemiBold       → Typography style
```

### Variables

```
Spacing/XS                   → 8px
Spacing/SM                   → 16px
Spacing/MD                   → 32px (must be multiples of 8)
Radius/Default               → 6px
Shadow/MD                    → Elevation shadow
```

## Troubleshooting

### "Cannot connect to Figma MCP"

- Restart Claude Desktop/VSCode after updating configuration
- Verify the JSON config is valid (no trailing commas)
- Check that you're using `https://mcp.figma.com/mcp` (official URL)

### "Authentication failed"

- Try re-authenticating: Claude will prompt you when needed
- Check Figma account permissions
- Ensure you have access to the specific Figma file

### "Permission denied accessing Figma file"

- Verify you have at least "View" permissions on the file
- Check that the file key is correct
- Try accessing the file directly in Figma browser first

### "Validation failed" after sync

- Check that all spacing values are multiples of 8px in Figma
- Ensure all color values use valid formats
- Run `yarn validate` to see specific errors

## Security Notes

✅ **Security Advantages of Official Figma MCP:**

- **OAuth-based authentication** (no manual token management)
- **Scoped permissions** (you control what Claude can access)
- **Revocable access** (disconnect anytime from Figma settings)
- **No secrets in repository** (authentication handled by Figma)
- **Secure remote server** (hosted by Figma, not local processes)

The `.mcp.json` file contains no secrets - just the server URL.

## Differences from npm-based MCP

**Official Figma MCP (Remote):**

- ✅ OAuth authentication (secure, no token management)
- ✅ Hosted by Figma (always up to date)
- ✅ No local installation required
- ✅ Works across all devices once authenticated

**npm Package Approach (Not used here):**

- ❌ Requires personal access token management
- ❌ Token stored in environment variables
- ❌ Manual token rotation
- ❌ Local process security concerns

We use the **official remote MCP** for better security and ease of use.

## Resources

- [Official Figma MCP Documentation](https://developers.figma.com/docs/figma-mcp-server/)
- [Model Context Protocol Spec](https://modelcontextprotocol.io/)
- [Figma API Documentation](https://www.figma.com/developers/api)
- [Design System CLAUDE.md](./CLAUDE.md) - Full sync workflow

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Verify your Figma file permissions
3. Try re-authenticating with Figma
4. Ask in the #design-systems Slack channel
5. Open an issue in the repository with MCP logs

## Quick Reference

```bash
# Add Figma MCP (Claude Code)
claude mcp add --transport http figma https://mcp.figma.com/mcp

# Test connection
# In Claude: "Can you list the Figma MCP tools available?"

# Sync tokens
# In Claude: "Sync design tokens from Figma file ABC123XYZ"

# Check sync status
cat figma/sync-manifest.json
```
