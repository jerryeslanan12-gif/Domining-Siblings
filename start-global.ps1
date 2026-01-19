# ============================================
# Domining Sibling - Ngrok Public Server
# ============================================

$ErrorActionPreference = "Stop"

Write-Host "Checking ngrok installation..." -ForegroundColor Cyan

$ngrokCmd = "ngrok"
if (Test-Path ".\ngrok.exe") {
    $ngrokCmd = ".\ngrok.exe"
    Write-Host "Using local ngrok." -ForegroundColor Green
} elseif (Get-Command ngrok -ErrorAction SilentlyContinue) {
    Write-Host "Using system ngrok." -ForegroundColor Green
} else {
    Write-Host "Ngrok not found. Downloading..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri 'https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip' -OutFile 'ngrok.zip'
        Expand-Archive 'ngrok.zip' -DestinationPath . -Force
        Remove-Item 'ngrok.zip'
        $ngrokCmd = ".\ngrok.exe"
        Write-Host "Ngrok downloaded." -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to download ngrok." -ForegroundColor Red
        exit 1
    }
}

# Get Local IP
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*"} | Select-Object -First 1).IPAddress
Write-Host "Local IP: $localIP" -ForegroundColor Green

# Start Backend
Write-Host "Starting Backend (3001)..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -NoNewWindow
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "Starting Frontend (5173)..." -ForegroundColor Yellow
$frontendProcess = Start-Process -FilePath "cmd" -ArgumentList "/c npm run dev" -PassThru -NoNewWindow
Start-Sleep -Seconds 5

# Start Ngrok
Write-Host "Starting Ngrok Tunnel..." -ForegroundColor Yellow
$ngrokProcess = Start-Process -FilePath $ngrokCmd -ArgumentList "http 5173 --log=stdout" -PassThru -NoNewWindow
Start-Sleep -Seconds 5

# Fetch URL
try {
    $ngrokApi = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels"
    $publicUrl = $ngrokApi.tunnels[0].public_url
    
    Write-Host ""
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host "   PUBLIC URL: $publicUrl" -ForegroundColor Green
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "Could not fetch ngrok URL. Check http://localhost:4040" -ForegroundColor Red
}

Write-Host "Press Ctrl+C to stop." -ForegroundColor Gray

# Keep alive
try {
    while ($true) { Start-Sleep -Seconds 1 }
}
finally {
    Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $ngrokProcess.Id -Force -ErrorAction SilentlyContinue
}
