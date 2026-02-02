$extensionPath = "C:\TFS\Extensions\extension-manager-pro"
$userDataDir = Join-Path $PSScriptRoot "chrome-debug-profile"
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$debugPort = 9222

Write-Host "Launching Chrome with debugging enabled..." -ForegroundColor Green
Write-Host "Profile directory: $userDataDir" -ForegroundColor Cyan
Write-Host "Debug port: $debugPort" -ForegroundColor Cyan
Write-Host ""

# Launch Chrome with extension support enabled
$chromeArgs = "--remote-debugging-port=$debugPort `"--user-data-dir=$userDataDir`" https://google.com"
Start-Process -FilePath $chromePath -ArgumentList $chromeArgs
