# Stagehand MCP with CDP Support

A modified version of [stagehand-mcp-local](https://github.com/weijiafu14/stagehand-mcp-local) that adds support for connecting to an existing Chrome browser via Chrome DevTools Protocol (CDP).

## 🎯 What's This For?

This fork enables Stagehand MCP to control a **visible Chrome browser with extensions loaded**, instead of launching a new headless browser. Perfect for:

- 🧩 **Using Chrome extensions** during automation
- 👀 **Visual debugging** - see what's happening in real-time
- 🔄 **Reusing browser sessions** with your settings and extensions
- 🎮 **Full control** over browser launch parameters
- 🌍 **Cross-platform** - works on Windows, macOS, and Linux

## ✨ Features

- ✅ Connect to existing Chrome via CDP
- ✅ Load and use Chrome extensions during automation
- ✅ Persistent Chrome profile with saved extensions and settings
- ✅ Fallback to local browser launch if CDP_URL not set
- ✅ Full Stagehand MCP functionality
- ✅ Works with any Chromium-based browser
- ✅ Cross-platform support (Windows, macOS, Linux)

## 📋 Prerequisites

- **Node.js** 18 or higher
- **npm** or **pnpm**
- **Google Chrome** or any Chromium-based browser
- **OpenAI API key** (for GPT models) or **Gemini API key** (for Gemini models)
- **MCP Client** (e.g., Claude Desktop, Abacus AI Desktop)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/prince-lonestar/stagehand-mcp-local-cdp.git
cd stagehand-mcp-local-cdp
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

#### For Claude Desktop

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`  
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Linux:** `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "stagehand-cdp": {
      "command": "node",
      "args": ["/path/to/stagehand-mcp-local-cdp/cli.js"],
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

#### For Abacus AI Desktop

Add via Settings → Integrations → MCP Servers using the same configuration.

#### Path Examples by Platform

**Windows:**
```json
"args": ["C:/Users/YourName/stagehand-mcp-local-cdp/cli.js"]
```

**macOS:**
```json
"args": ["/Users/YourName/stagehand-mcp-local-cdp/cli.js"]
```

**Linux:**
```json
"args": ["/home/yourname/stagehand-mcp-local-cdp/cli.js"]
```

**Important Notes:**
- Use forward slashes (`/`) in paths - they work on all platforms including Windows
- Replace the path with the actual location where you cloned this repository
- Replace `your-openai-api-key-here` with your actual OpenAI API key
- For Gemini models, use `GEMINI_API_KEY` instead and set `STAGEHAND_MODEL` to `gemini-2.0-flash` or similar

## 🎮 Usage

### Step 1: Launch Chrome with Remote Debugging

#### Windows

Run the provided PowerShell script:

```powershell
.\launch-chrome-debug.ps1
```

#### macOS / Linux

Run the provided bash script:

```bash
./launch-chrome-debug.sh
```

**Note:** On first run, you may need to make the script executable:
```bash
chmod +x launch-chrome-debug.sh
```

Both scripts will:
- Launch Chrome with remote debugging on port 9222
- Create a persistent profile directory
- Allow you to install and use Chrome extensions
- Open Google as the starting page

**First Time Setup:**
1. After launching Chrome, install any extensions you need from the Chrome Web Store
2. Extensions will persist between sessions in the profile directory

**Configuring Extensions:**
- **Windows:** Edit `$extensionPath` in `launch-chrome-debug.ps1`
- **macOS/Linux:** Edit `EXTENSION_PATH` in `launch-chrome-debug.sh`

### Step 2: Start Your MCP Client

Launch your MCP client (Claude Desktop, Abacus AI Desktop, etc.). It will automatically connect to the running Chrome instance.

### Step 3: Use Stagehand Commands

You can now use Stagehand MCP tools to automate the visible Chrome browser:

- `browserbase_stagehand_navigate` - Navigate to a URL
- `browserbase_stagehand_act` - Perform actions (click, type, etc.)
- `browserbase_stagehand_extract` - Extract data from pages
- `browserbase_stagehand_observe` - Find elements on the page
- `browserbase_screenshot` - Take screenshots

## ⚠️ Known Issues

### Act Tool - DISABLED BY DEFAULT

The `browserbase_stagehand_act` tool has been **disabled by default** in this fork due to intermittent Zod schema validation errors with Stagehand 3.0.8 (latest stable version). This is a [known upstream issue](https://github.com/browserbase/stagehand/issues/676) in the Stagehand library.

**Status:** 4 out of 5 tools fully functional
- ✅ Navigate - Working
- ✅ Observe - Working
- ✅ Extract - Working
- ✅ Screenshot - Working
- ❌ Act - **DISABLED** (intermittent failures)

**Recommended Workaround:**

Use the **Observe** tool (which works perfectly) combined with direct Playwright commands. See [ACT_TOOL_TROUBLESHOOTING.md](ACT_TOOL_TROUBLESHOOTING.md) for detailed solutions.

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `STAGEHAND_ENV` | Environment mode | `LOCAL` | Yes |
| `CDP_URL` | Chrome DevTools Protocol URL | `http://localhost:9222` | Yes (for CDP mode) |
| `HEADLESS` | Run browser in headless mode | `false` | No |
| `STAGEHAND_MODEL` | AI model to use | `gpt-4o` | Yes |
| `OPENAI_API_KEY` | OpenAI API key | - | Yes (for GPT models) |
| `GEMINI_API_KEY` | Google Gemini API key | - | Yes (for Gemini models) |

### Chrome Launch Options

Both launch scripts support customization:

**Debug Port:** Change `9222` to another port if needed (update both script and MCP config)

**Profile Directory:**
- **Windows:** `$userDataDir` in PowerShell script
- **macOS/Linux:** `USER_DATA_DIR` in bash script

**Extension Loading:**
- Set the extension path variable to load extensions on startup
- Leave as placeholder to launch without extensions

## 🐛 Troubleshooting

### Chrome Won't Launch

**Windows:**
- **Error:** "Chrome executable not found"
- **Solution:** Update `$chromePath` in `launch-chrome-debug.ps1`

**macOS:**
- **Error:** "Chrome not found at /Applications/Google Chrome.app"
- **Solution:** Install Chrome or update `CHROME_PATH` in `launch-chrome-debug.sh`

**Linux:**
- **Error:** "Chrome/Chromium not found"
- **Solution:** Install Chrome or Chromium:
  ```bash
  # Ubuntu/Debian
  sudo apt install google-chrome-stable
  # or
  sudo apt install chromium-browser
  
  # Fedora
  sudo dnf install google-chrome-stable
  # or
  sudo dnf install chromium
  ```

### Extension Issues

**Error:** "Extension path does not exist"
- **Solution:** Update the extension path in the launch script to point to your extension directory
- **Note:** Extensions must be unpacked (not .crx files)

### MCP Server Errors

**Error:** "Cannot connect to CDP"
- **Solution:** Make sure Chrome is running with remote debugging enabled
- **Check:** Visit `http://localhost:9222/json` in a browser to verify CDP is accessible

**Error:** "OPENAI_API_KEY not set"
- **Solution:** Add your API key to the MCP configuration

### Port Already in Use

**Error:** "Port 9222 is already in use"
- **Solution:** Close any existing Chrome instances with debugging enabled, or change the port in both the launch script and your MCP config

### Platform-Specific Issues

**macOS:** "Cannot be opened because the developer cannot be verified"
- **Solution:** Right-click the script → Open, or run: `xattr -d com.apple.quarantine launch-chrome-debug.sh`

**Linux:** Permission denied
- **Solution:** Make the script executable: `chmod +x launch-chrome-debug.sh`

**Windows:** Script execution disabled
- **Solution:** Run PowerShell as Administrator and execute:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

## 📁 Project Structure

```
stagehand-mcp-local-cdp/
├── launch-chrome-debug.ps1      # Windows Chrome launcher
├── launch-chrome-debug.sh       # macOS/Linux Chrome launcher
├── mcp-config-template.json     # MCP configuration template
├── cli.js                       # MCP server entry point
├── index.js                     # Main module
├── src/                         # TypeScript source files
│   ├── sessionManager.ts        # Modified for CDP support
│   └── ...
├── dist/                        # Compiled JavaScript (after build)
├── package.json
├── tsconfig.json
├── README.md                    # This file
├── LICENSE                      # Apache-2.0 license
├── CONTRIBUTING.md              # Contribution guidelines
└── .gitignore
```

## 🔄 Development

### Rebuilding After Changes

If you modify the source code:

```bash
npm run build
```

### Running in Watch Mode

For active development:

```bash
npm run watch
```

### Linting and Formatting

```bash
npm run lint
npm run format
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 Credits

- Original project: [stagehand-mcp-local](https://github.com/weijiafu14/stagehand-mcp-local) by weijiafu14
- Stagehand framework: [Browserbase Stagehand](https://github.com/browserbase/stagehand)
- CDP support and cross-platform enhancements by Jay Farr

## 📄 License

Apache-2.0 (same as original project)

## 💬 Support

For issues specific to CDP support or cross-platform functionality:
1. Check that Chrome is running with `--remote-debugging-port=9222`
2. Verify `CDP_URL` environment variable is set correctly
3. Ensure no firewall is blocking localhost:9222
4. Confirm extension paths are correct and accessible

For general Stagehand issues, refer to the [official Stagehand documentation](https://docs.stagehand.dev/).

## 🌟 Why This Fork?

The original `stagehand-mcp-local` launches its own browser instance, which doesn't support Chrome extensions. This fork:

1. **Connects to existing Chrome** via CDP instead of launching a new instance
2. **Supports extensions** by using a real Chrome browser with full extension support
3. **Provides visibility** - you can watch the automation happen in real-time
4. **Maintains persistence** - browser profile, extensions, and settings are saved
5. **Works everywhere** - cross-platform scripts for Windows, macOS, and Linux

Perfect for development, testing, and automation workflows that need Chrome extensions!
