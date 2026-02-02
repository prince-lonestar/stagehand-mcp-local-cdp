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
        "/path/to/stagehand-mcp-local-cdp/cli.js"
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

**Note:** Replace `/path/to/stagehand-mcp-local-cdp/` with the actual path where you cloned this repository.

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
=======
# Stagehand MCP with CDP Support

A modified version of [stagehand-mcp-local](https://github.com/weijiafu14/stagehand-mcp-local) that adds support for connecting to an existing Chrome browser via Chrome DevTools Protocol (CDP).

## 🎯 What's This For?

This fork enables Stagehand MCP to control a **visible Chrome browser with extensions loaded**, instead of launching a new headless browser. Perfect for:

- 🧩 **Using Chrome extensions** during automation
- 👀 **Visual debugging** - see what's happening in real-time
- 🔄 **Reusing browser sessions** with your settings and extensions
- 🎮 **Full control** over browser launch parameters

## ✨ Features

- ✅ Connect to existing Chrome via CDP
- ✅ Load and use Chrome extensions during automation
- ✅ Persistent Chrome profile with saved extensions and settings
- ✅ Fallback to local browser launch if CDP_URL not set
- ✅ Full Stagehand MCP functionality
- ✅ Works with any Chromium-based browser

## 📋 Prerequisites

- **Node.js** 18 or higher
- **npm** or **pnpm**
- **Google Chrome** or any Chromium-based browser
- **OpenAI API key** (for GPT models) or **Gemini API key** (for Gemini models)
- **MCP Client** (e.g., Claude Desktop, Abacus AI Desktop)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/stagehand-mcp-cdp.git
cd stagehand-mcp-cdp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Project

```bash
npm run build
```

This compiles the TypeScript code to JavaScript in the `dist/` directory.

### 4. Configure Your MCP Client

Add the following configuration to your MCP client's config file:

**For Claude Desktop** (`%APPDATA%\Claude\claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "stagehand-cdp": {
      "command": "node",
      "args": ["cli.js"],
      "cwd": "C:\\path\\to\\stagehand-mcp-cdp",
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

**For Abacus AI Desktop** - Add via Settings → Integrations → MCP Servers using the same configuration.

**Important Notes:**
- Replace `C:\\path\\to\\stagehand-mcp-cdp` with the actual path to your cloned repository
- Replace `your-openai-api-key-here` with your actual OpenAI API key
- For Gemini models, use `GEMINI_API_KEY` instead and set `STAGEHAND_MODEL` to `gemini-2.0-flash` or similar

## 🎮 Usage

### Step 1: Launch Chrome with Remote Debugging

Run the provided PowerShell script:

```powershell
.\launch-chrome-debug.ps1
```

This will:
- Launch Chrome with remote debugging on port 9222
- Create a persistent profile in `chrome-debug-profile/`
- Allow you to install and use Chrome extensions
- Open Google as the starting page

**First Time Setup:**
1. After launching Chrome, install any extensions you need from the Chrome Web Store
2. Extensions will persist between sessions in the `chrome-debug-profile/` directory

### Step 2: Start Your MCP Client

Launch your MCP client (Claude Desktop, Abacus AI Desktop, etc.). It will automatically connect to the running Chrome instance.

### Step 3: Use Stagehand Commands

You can now use Stagehand MCP tools to automate the visible Chrome browser:

- `browserbase_stagehand_navigate` - Navigate to a URL
- `browserbase_stagehand_act` - Perform actions (click, type, etc.)
- `browserbase_stagehand_extract` - Extract data from pages
- `browserbase_stagehand_observe` - Find elements on the page
- `browserbase_screenshot` - Take screenshots

**Example:**
```
Navigate to https://example.com and take a screenshot
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CDP_URL` | No | - | Chrome DevTools Protocol URL (e.g., `http://localhost:9222`) |
| `STAGEHAND_ENV` | Yes | - | Must be `LOCAL` for CDP support |
| `STAGEHAND_MODEL` | Yes | - | AI model to use (e.g., `gpt-4o`, `gemini-2.0-flash`) |
| `OPENAI_API_KEY` | Conditional | - | Required if using OpenAI models |
| `GEMINI_API_KEY` | Conditional | - | Required if using Gemini models |
| `HEADLESS` | No | `true` | Ignored when using CDP (browser is always visible) |

### Customizing Chrome Launch

Edit `launch-chrome-debug.ps1` to customize Chrome launch options:

```powershell
$userDataDir = Join-Path $PSScriptRoot "chrome-debug-profile"  # Profile directory
$debugPort = 9222                                               # CDP port
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"  # Chrome path
```

## 🧪 Testing

### Test Chrome CDP Connection

After launching Chrome with the script, verify CDP is accessible:

```powershell
Invoke-WebRequest -Uri "http://localhost:9222/json" | Select-Object -ExpandProperty Content
```

You should see JSON output with browser information.

### Test MCP Server

The MCP server will automatically start when you launch your MCP client. Check the client's logs for:

```
[SessionManager] Creating LOCAL Stagehand instance with CDP connection to http://localhost:9222
```

## 🛠️ How It Works

### CDP Connection Flow

1. **Chrome Launch**: The `launch-chrome-debug.ps1` script starts Chrome with `--remote-debugging-port=9222`
2. **MCP Server Start**: When the MCP server starts, it reads the `CDP_URL` environment variable
3. **WebSocket Conversion**: The server converts the HTTP CDP URL to a WebSocket URL by querying `http://localhost:9222/json/version`
4. **Connection**: Stagehand connects to the existing Chrome instance via the WebSocket URL
5. **Automation**: All Stagehand commands now control the visible Chrome browser

### Key Code Changes

The main modification is in `src/sessionManager.ts`:

```typescript
async function getWebSocketCdpUrl(httpCdpUrl: string): Promise<string> {
  const response = await fetch(`${httpCdpUrl}/json/version`);
  const data = await response.json();
  return data.webSocketDebuggerUrl;
}

if (isLocalMode && process.env.CDP_URL) {
  const cdpUrl = process.env.CDP_URL;
  const wsUrl = await getWebSocketCdpUrl(cdpUrl);

  stagehand = new Stagehand({
    env: "LOCAL",
    localBrowserLaunchOptions: {
      cdpUrl: wsUrl,  // WebSocket URL for CDP connection
    },
    // ... other options
  });
}
```

## 🐛 Troubleshooting

### Chrome Won't Launch

- **Error**: "Cannot find Chrome executable"
  - **Solution**: Update `$chromePath` in `launch-chrome-debug.ps1` to point to your Chrome installation

### MCP Server Can't Connect

- **Error**: "Failed to get WebSocket CDP URL"
  - **Solution**: Ensure Chrome is running with `--remote-debugging-port=9222`
  - **Check**: Visit `http://localhost:9222/json` in a browser to verify CDP is accessible

### Extensions Not Persisting

- **Error**: Extensions disappear after restarting Chrome
  - **Solution**: Make sure you're using the updated `launch-chrome-debug.ps1` script that properly quotes the profile path
  - **Check**: Verify the profile directory exists at `chrome-debug-profile/`

### Build Errors

- **Error**: TypeScript compilation errors
  - **Solution**: Ensure you're using Node.js 18 or higher
  - **Solution**: Delete `node_modules/` and `package-lock.json`, then run `npm install` again

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Original [stagehand-mcp-local](https://github.com/weijiafu14/stagehand-mcp-local) by weijiafu14
- [Stagehand](https://github.com/browserbase/stagehand) by Browserbase
- [Model Context Protocol](https://modelcontextprotocol.io/) by Anthropic

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📧 Support

If you encounter issues:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/YOUR_USERNAME/stagehand-mcp-cdp/issues)
3. Create a new issue with detailed information about your problem

---

**Note**: This is a community fork and is not officially affiliated with Browserbase or the original stagehand-mcp-local project.
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
        "/path/to/stagehand-mcp-local-cdp/cli.js"
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

**Note:** Replace `/path/to/stagehand-mcp-local-cdp/` with the actual path where you cloned this repository.

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
