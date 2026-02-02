#!/bin/bash

# Configuration
EXTENSION_PATH="/path/to/your/extension"
DEBUG_PORT=9222
USER_DATA_DIR="$HOME/.chrome-debug-profile"

# Detect Chrome executable based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux - try common locations
    if command -v google-chrome &> /dev/null; then
        CHROME_PATH="google-chrome"
    elif command -v chromium-browser &> /dev/null; then
        CHROME_PATH="chromium-browser"
    elif command -v chromium &> /dev/null; then
        CHROME_PATH="chromium"
    else
        echo "Error: Chrome/Chromium not found. Please install Google Chrome or Chromium."
        exit 1
    fi
else
    echo "Error: Unsupported operating system: $OSTYPE"
    exit 1
fi

# Validate Chrome executable exists (for macOS)
if [[ "$OSTYPE" == "darwin"* ]] && [[ ! -f "$CHROME_PATH" ]]; then
    echo "Error: Chrome not found at $CHROME_PATH"
    echo "Please install Google Chrome or update CHROME_PATH in this script."
    exit 1
fi

# Build Chrome arguments
CHROME_ARGS=(
    "--remote-debugging-port=$DEBUG_PORT"
    "--user-data-dir=$USER_DATA_DIR"
    "--no-first-run"
    "--no-default-browser-check"
)

# Add extension if path is configured and exists
if [[ "$EXTENSION_PATH" != "/path/to/your/extension" ]] && [[ -d "$EXTENSION_PATH" ]]; then
    echo "Loading extension from: $EXTENSION_PATH"
    CHROME_ARGS+=("--load-extension=$EXTENSION_PATH")
elif [[ "$EXTENSION_PATH" != "/path/to/your/extension" ]]; then
    echo "Warning: Extension path configured but directory not found: $EXTENSION_PATH"
    echo "Chrome will launch without extensions."
else
    echo "Note: Extension path not configured. Chrome will launch without extensions."
    echo "To load an extension, update EXTENSION_PATH in this script."
fi

# Display configuration
echo "Chrome Debug Configuration:"
echo "  Chrome Path: $CHROME_PATH"
echo "  Debug Port: $DEBUG_PORT"
echo "  User Data Dir: $USER_DATA_DIR"
echo ""

# Launch Chrome
echo "Launching Chrome in debug mode..."
"$CHROME_PATH" "${CHROME_ARGS[@]}" &

# Get the process ID
CHROME_PID=$!

echo ""
echo "Chrome launched successfully!"
echo "  Process ID: $CHROME_PID"
echo "  Debug URL: http://localhost:$DEBUG_PORT"
echo ""
echo "To stop Chrome, run: kill $CHROME_PID"
echo "Or close Chrome normally from the browser."
