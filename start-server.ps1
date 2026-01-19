# ============================================
# Domining Sibling - Global Server Setup
# ============================================
# This script makes your PC a standalone server accessible from anywhere

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   DOMINING SIBLING - GLOBAL SERVER INITIALIZATION     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Get local IP
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*"} | Select-Object -First 1).IPAddress

Write-Host "🖥️  Local Server IP: $localIP" -ForegroundColor Green
Write-Host ""

# Step 1: Start Backend Server
Write-Host "📡 Step 1: Starting Backend Server (Port 3001)..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -NoNewWindow
Start-Sleep -Seconds 2

# Step 2: Start Frontend Server
Write-Host "🌐 Step 2: Starting Frontend Server (Port 5173)..." -ForegroundColor Yellow
# Use cmd to avoid PowerShell execution policy issues with npm
$frontendProcess = Start-Process -FilePath "cmd" -ArgumentList "/c npm run dev" -PassThru -NoNewWindow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "✅ Servers are running!" -ForegroundColor Green
Write-Host ""

# Display Local Network Access
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║           LOCAL NETWORK ACCESS (Same WiFi)            ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""
Write-Host "📱 On this computer:" -ForegroundColor White
Write-Host "   http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 On other devices (same WiFi/network):" -ForegroundColor White
Write-Host "   http://${localIP}:5173" -ForegroundColor Cyan
Write-Host ""

# Step 3: Setup Public Tunnel
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         GLOBAL ACCESS (From Anywhere in World)        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "🌍 Setting up public tunnel (via Serveo)..." -ForegroundColor Yellow
Write-Host ""

if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ SSH not found. Only local access available." -ForegroundColor Red
} else {
    # Use Serveo SSH tunnel (most reliable, no installation needed)
    Write-Host "-------------------------------------------------------" -ForegroundColor Green
    Write-Host "   🌐 YOUR PUBLIC URL WILL APPEAR BELOW:" -ForegroundColor Green
    Write-Host "   Share this link with family anywhere in the world!" -ForegroundColor Green
    Write-Host "-------------------------------------------------------" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  Keep this window open to maintain the connection!" -ForegroundColor Yellow
    Write-Host "   Press Ctrl+C to stop the server" -ForegroundColor DarkGray
    Write-Host ""

    # Create SSH tunnel for frontend (port 5173)
    try {
        ssh -o StrictHostKeyChecking=no -R 80:localhost:5173 serveo.net
    } catch {
        Write-Host ""
        Write-Host "⚠️  SSH tunnel crashed or failed." -ForegroundColor Yellow
    }
}

# Cleanup on exit
Write-Host ""
Write-Host "🛑 Shutting down servers..." -ForegroundColor Red
Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
Write-Host "✅ Servers stopped." -ForegroundColor Green
