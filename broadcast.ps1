$ErrorActionPreference = "Stop"

Write-Host "Starting Domining Family Hub..." -ForegroundColor Cyan

# 1. Start the Multi-Device Node Server
Write-Host "1. Launching Domining Sync Server..." -ForegroundColor Yellow
$nodeProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -NoNewWindow

# 2. Wait for server to boot
Write-Host "   Waiting for server (3 seconds)..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# 3. Start the Tunnel
Write-Host "2. Establishing Global Broadcast Tunnel..." -ForegroundColor Yellow
Write-Host "   (Press Ctrl+C to stop broadcasting)" -ForegroundColor DarkGray
Write-Host ""
Write-Host "-------------------------------------------------------" -ForegroundColor Green
Write-Host "   YOUR FAMILY LINK IS BELOW (Copy the https link):" -ForegroundColor Green
Write-Host "-------------------------------------------------------" -ForegroundColor Green
Write-Host ""

# Serveo is often the most reliable no-install option
ssh -o StrictHostKeyChecking=no -R 80:localhost:3001 serveo.net

# Cleanup when ssh closes
Stop-Process -Id $nodeProcess.Id -Force
