# Developer Notes

## Project Status

This document tracks the development progress and key decisions for the stagehand-mcp-local-cdp project.

## Completed Tasks

### Repository Setup & Cleanup
- ✅ Removed .dockerignore file (no longer needed without Dockerfile)
- ✅ Updated/removed server.json (referenced original Browserbase project)
- ✅ Removed gemini-extension.json file
- ✅ Committed and pushed cleanup changes

### Tool Testing & Verification
- ✅ Troubleshot and fixed Observe tool GPT-4o API error - VERIFIED WORKING
- ✅ Tested all Stagehand tools - 4/5 working:
  - ✅ Navigate - Working
  - ✅ Observe - Working
  - ✅ Extract - Working
  - ✅ Screenshot - Working
  - ❌ Act - Intermittent failures (Zod schema validation errors with Stagehand 3.0.8)

### Documentation
- ✅ Documented Act tool limitation in README
- ✅ Created ACT_TOOL_TROUBLESHOOTING.md with detailed workarounds
- ✅ Committed and pushed test results and documentation

### Act Tool Disable
- ✅ Disabled Act tool registration in MCP server code (src/tools/index.ts)
- ✅ Updated README to reflect Act tool is now disabled by default
- ✅ Pushed Act tool disable changes to GitHub (with API keys removed from test files)
- ✅ Reduced tool count from 9 to 8 (only functional tools exposed)

## Pending Tasks

### Testing & Release
- ⏳ Test installation on another system to verify setup process
- ⏳ Make the repository public after successful testing

## Key Technical Decisions

### 1. Act Tool Disabled by Default
**Decision:** Commented out the Act tool in `src/tools/index.ts` to prevent it from being registered.

**Rationale:**
- The Act tool has intermittent Zod schema validation errors with Stagehand 3.0.8
- This is a known upstream issue (https://github.com/browserbase/stagehand/issues/676)
- Disabling prevents user confusion and failed automation attempts
- Users can still re-enable by uncommenting in source and rebuilding

**Implementation:**
```typescript
// src/tools/index.ts
// import actTool from "./act.js";  // Commented out
// export { default as actTool } from "./act.js";  // Commented out

export const TOOLS = [
  ...sessionTools,
  navigateTool,
  // actTool, // Disabled due to intermittent Zod schema validation errors with Stagehand 3.0.8
  extractTool,
  observeTool,
  screenshotTool,
  getUrlTool,
  agentTool,
];
```

### 2. Recommended Workaround for Act Tool
**Alternative Approach:** Use Observe + Playwright commands

```javascript
// Instead of: await stagehand.act('Click the login button')

// Use this approach:
const elements = await stagehand.observe('Find the login button');
const page = stagehand.context.pages()[0];
await page.click(`[data-element-id="${elements[0].elementId}"]`);
```

**Benefits:**
- More reliable execution
- Faster performance (no AI inference for actions)
- Better error handling
- Full control over timing and behavior

### 3. Cross-Platform Support
**Decision:** Provide both PowerShell and Bash scripts for Chrome debugging.

**Files:**
- `launch-chrome-debug.ps1` - Windows
- `launch-chrome-debug.sh` - macOS/Linux

**Features:**
- Auto-detection of Chrome installation
- Configurable extension paths
- Persistent profile support
- CDP debugging on port 9222

### 4. API Key Security
**Decision:** Remove hardcoded API keys from test files before pushing to GitHub.

**Implementation:**
- Replaced hardcoded keys with environment variable references
- Used pattern: `process.env.OPENAI_API_KEY || 'your-openai-api-key-here'`
- GitHub push protection caught the initial attempt and prevented secret exposure

## Repository Information

- **GitHub URL:** https://github.com/prince-lonestar/stagehand-mcp-local-cdp
- **Author:** Jay Farr
- **License:** Apache-2.0
- **Based on:** stagehand-mcp-local by weijiafu14

## Tool Count

- **Original:** 9 tools (including Act)
- **Current:** 8 tools (Act disabled)

## Next Steps

1. Test the installation process on a clean system
2. Verify all 8 tools work correctly after fresh install
3. Confirm Chrome profile persistence works as expected
4. Make repository public once testing is complete
5. Consider adding CI/CD for automated testing

## Notes

- The Abacus Desktop GUI tool toggle feature does not actually disable MCP tools at the server level
- To truly disable a tool, it must be removed from the source code and rebuilt
- The MCP server advertises all tools it registers, regardless of GUI settings
