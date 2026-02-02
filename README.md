# Stagehand MCP with CDP Support

A modified version of [stagehand-mcp-local](https://github.com/weijiafu14/stagehand-mcp-local) that adds support for connecting to an existing Chrome browser via Chrome DevTools Protocol (CDP).

## What's New

This fork adds the ability to connect to a running Chrome instance with extensions loaded, instead of launching a new headless browser. This is useful when you need:

- Chrome extensions loaded during automation
- A visible browser for debugging
- To reuse an existing browser session
- Full control over browser launch parameters

## Features

- ✅ Connect to existing Chrome via CDP
- ✅ Load Chrome extensions during automation
- ✅ Fallback to local browser launch if CDP_URL not set
- ✅ Full Stagehand MCP functionality
- ✅ Works with any Chromium-based browser

## Quick Start

### 1. Launch Chrome with Remote Debugging

Run the provided PowerShell script to launch Chrome with CDP enabled:

```powershell
powershell -ExecutionPolicy Bypass -File launch-chrome-debug.ps1
```

This will:
- Launch Chrome with remote debugging on port 9222
- Load the extension from `C:\TFS\Extensions\extension-manager-pro`
- Create a separate user profile in `chrome-debug-profile/`
- Open Google as the starting page

### 2. Configure Your MCP Client

Update your MCP configuration file (e.g., `mcp.json` or Claude Desktop config) with the settings from `mcp-config-template.json`:

```json
{
  "mcpServers": {
    "stagehand": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "C:\\Users\\Jason\\AppData\\Roaming\\AbacusAI\\Agent Workspaces\\Local-Stagehand-MCP\\Project\\temp-stagehand-mcp",
      "env": {
        "OPENAI_API_KEY": "your-openai-api-key-here",
        "STAGEHAND_MODEL": "gpt-4o",
        "STAGEHAND_ENV": "LOCAL",
        "HEADLESS": "false",
        "CDP_URL": "http://localhost:9222"
      }
    }
  }
}
```

**Important:** Replace `your-openai-api-key-here` with your actual OpenAI API key.

### 3. Start Using Stagehand

Your MCP client (e.g., Claude Desktop, Abacus AI) will now connect to the running Chrome instance via CDP.

## How It Works

### CDP Connection Flow

1. **Chrome Launch**: The `launch-chrome-debug.ps1` script starts Chrome with `--remote-debugging-port=9222`
2. **MCP Server Start**: When the MCP server starts, it reads the `CDP_URL` environment variable
3. **Connection**: If `CDP_URL` is set, Stagehand connects to the existing Chrome instance instead of launching a new one
4. **Automation**: All Stagehand commands now control the visible Chrome browser with extensions loaded

### Code Changes

The main modification is in `Project/temp-stagehand-mcp/src/sessionManager.ts`:

```typescript
if (isLocalMode) {
  const cdpUrl = process.env.CDP_URL;
  
  if (cdpUrl) {
    // Connect to existing Chrome via CDP
    stagehand = new Stagehand({
      env: "LOCAL",
      localBrowserLaunchOptions: {
        cdpUrl: cdpUrl,
      },
      // ... other options
    });
  } else {
    // Fallback: Launch new browser
    stagehand = new Stagehand({
      env: "LOCAL",
      localBrowserLaunchOptions: {
        headless: true,
        // ... other options
      },
    });
  }
}
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CDP_URL` | No | - | Chrome DevTools Protocol URL (e.g., `http://localhost:9222`) |
| `STAGEHAND_ENV` | Yes | - | Must be `LOCAL` for CDP support |
| `STAGEHAND_MODEL` | Yes | - | AI model to use (e.g., `gpt-4o`, `gemini-2.0-flash`) |
| `OPENAI_API_KEY` | Yes* | - | OpenAI API key (*required if using OpenAI models) |
| `GEMINI_API_KEY` | Yes* | - | Google Gemini API key (*required if using Gemini models) |
| `HEADLESS` | No | `true` | Ignored when using CDP (browser is always visible) |

### Chrome Launch Options

Edit `launch-chrome-debug.ps1` to customize:

```powershell
$extensionPath = "C:\TFS\Extensions\extension-manager-pro"  # Your extension path
$debugPort = 9222                                            # CDP port
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"  # Chrome executable
```

## 🧪 Testing

### 1. Test Chrome with CDP

First, launch Chrome with CDP enabled:

```powershell
.\launch-chrome-debug.ps1
```

Verify CDP is accessible:

```powershell
Invoke-WebRequest -Uri "http://localhost:9222/json" | Select-Object -ExpandProperty Content
```

### 2. Test MCP Server

Run the test script:

```powershell
.\test-mcp-server.ps1
```

You should see:
```
========================================
Testing Stagehand MCP Server with CDP
========================================

Environment Variables:
  STAGEHAND_ENV: LOCAL
  STAGEHAND_MODEL: gpt-4o
  CDP_URL: http://localhost:9222
  HEADLESS: false

Starting MCP Server...
Press Ctrl+C to stop

[Config] Running in LOCAL mode - Browserbase credentials not required
```

The server is now running and waiting for MCP client connections via stdio.

### 3. Configure Abacus AI Desktop

1. Open Abacus AI Desktop settings
2. Navigate to MCP configuration
3. Add the configuration from `mcp-config-template.json`:

```json
{
  "mcpServers": {
    "stagehand": {
      "command": "node",
      "args": [
        "C:\\Users\\Jason\\AppData\\Roaming\\AbacusAI\\Agent Workspaces\\Local-Stagehand-MCP\\Project\\temp-stagehand-mcp\\cli.js"
      ],
      "env": {
        "STAGEHAND_ENV": "LOCAL",
        "STAGEHAND_MODEL": "gpt-4o",
        "OPENAI_API_KEY": "YOUR_OPENAI_API_KEY_HERE",
        "CDP_URL": "http://localhost:9222",
        "HEADLESS": "false"
      }
    }
  }
}
```

4. Replace `YOUR_OPENAI_API_KEY_HERE` with your actual OpenAI API key
5. Save and restart Abacus AI Desktop

### 4. Verify Connection

After restarting Abacus AI Desktop:

1. Check the MCP server logs in Abacus AI
2. You should see the server connect successfully
3. Try a simple command like "Navigate to google.com"
4. The Chrome window you launched should respond to commands

This should return a JSON list of available targets.

## Troubleshooting

### Chrome Won't Launch

**Error:** "Chrome executable not found"
- **Solution:** Update `$chromePath` in `launch-chrome-debug.ps1` to point to your Chrome installation

**Error:** "Extension path does not exist"
- **Solution:** Update `$extensionPath` in `launch-chrome-debug.ps1` to point to your extension

### MCP Server Errors

**Error:** "Cannot connect to CDP"
- **Solution:** Make sure Chrome is running with remote debugging enabled
- **Check:** Visit `http://localhost:9222/json` to verify CDP is accessible

**Error:** "OPENAI_API_KEY not set"
- **Solution:** Add your API key to the MCP configuration

### Port Already in Use

**Error:** "Port 9222 is already in use"
- **Solution:** Close any existing Chrome instances with debugging enabled, or change the port in both `launch-chrome-debug.ps1` and your MCP config

## Development

### Rebuilding After Changes

If you modify the source code:

```powershell
cd Project\temp-stagehand-mcp
npm run build
```

### Project Structure

```
Local-Stagehand-MCP/
├── launch-chrome-debug.ps1          # Chrome launcher script
├── test-mcp-server.ps1              # Test script
├── mcp-config-template.json         # MCP configuration template
├── README.md                        # This file
├── chrome-debug-profile/            # Chrome user data (created on first run)
└── Project/
    └── temp-stagehand-mcp/          # MCP server source and build
        ├── src/
        │   ├── sessionManager.ts    # Modified for CDP support
        │   └── ...
        ├── dist/                    # Compiled JavaScript
        ├── package.json
        └── tsconfig.json
```

## Credits

- Original project: [stagehand-mcp-local](https://github.com/weijiafu14/stagehand-mcp-local) by weijiafu14
- Stagehand framework: [Browserbase Stagehand](https://github.com/browserbase/stagehand)
- CDP support added for extension compatibility

## License

Apache-2.0 (same as original project)

## Support

For issues specific to CDP support, please check:
1. Chrome is running with `--remote-debugging-port=9222`
2. `CDP_URL` environment variable is set correctly
3. No firewall blocking localhost:9222
4. Extension path is correct and accessible

For general Stagehand issues, refer to the [official Stagehand documentation](https://docs.stagehand.dev/).
