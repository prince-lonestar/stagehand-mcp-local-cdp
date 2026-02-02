# CONFIGURATION - Update these paths for your system
$extensionPath = "C:\path\to\your\extension"  # Set to your extension path, or leave empty to skip extension loading
$userDataDir = Join-Path $PSScriptRoot "chrome-debug-profile"
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$debugPort = 9222

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Chrome CDP Debug Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "User data dir:  $userDataDir" -ForegroundColor Yellow
Write-Host "Debug port:     $debugPort" -ForegroundColor Yellow

if ($extensionPath -and $extensionPath -ne "C:\path\to\your\extension") {
    Write-Host "Extension path: $extensionPath" -ForegroundColor Yellow

    if (-not (Test-Path $extensionPath)) {
        Write-Host ""
        Write-Host "WARNING: Extension path does not exist!" -ForegroundColor Yellow
        Write-Host "Path: $extensionPath" -ForegroundColor Yellow
        Write-Host "Chrome will launch without the extension." -ForegroundColor Yellow
        $extensionPath = $null
    }
} else {
    Write-Host "Extension path: Not configured (Chrome will launch without extensions)" -ForegroundColor Yellow
    $extensionPath = $null
}

Write-Host ""

if (-not (Test-Path $chromePath)) {
    Write-Host "ERROR: Chrome executable not found!" -ForegroundColor Red
    Write-Host "Path: $chromePath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please update the `$chromePath variable in this script to point to your Chrome installation." -ForegroundColor Yellow
    exit 1
}

Write-Host "Launching Chrome with remote debugging enabled..." -ForegroundColor Green
Write-Host ""

$arguments = @(
    "--remote-debugging-port=$debugPort",
    "--user-data-dir=$userDataDir"
)

if ($extensionPath) {
    $arguments += "--disable-extensions-except=$extensionPath"
    $arguments += "--load-extension=$extensionPath"
}

$arguments += "https://google.com"

Start-Process -FilePath $chromePath -ArgumentList $arguments

Write-Host "Chrome launched successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "CDP URL: http://localhost:$debugPort" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now run the Stagehand MCP server with CDP_URL=http://localhost:$debugPort" -ForegroundColor Yellow
Write-Host ""
