# 🌍 Domining Sibling - Global Server Setup Guide

## 🎯 Make Your PC a Standalone Server Accessible from Anywhere!

This guide will help you set up your computer as a server so family members can access the Domining Sibling app from anywhere in the world.

---

## 📋 Quick Start (3 Options)

### ✨ **Option 1: Ngrok (Recommended - Most Reliable)**

**Best for:** Easy setup, reliable connection, works everywhere

1. **Run the global server script:**
   ```powershell
   npm run global
   ```
   OR
   ```powershell
   powershell -ExecutionPolicy Bypass -File ./start-global.ps1
   ```

2. **The script will:**
   - Automatically install ngrok if needed
   - Start both backend and frontend servers
   - Create a public URL (e.g., `https://abc123.ngrok.io`)
   - Display the URL you can share with family

3. **Share the URL** with your family members - they can access it from anywhere!

**Pros:**
- ✅ Very reliable
- ✅ HTTPS enabled (secure)
- ✅ Works through firewalls
- ✅ Easy to use

**Cons:**
- ⚠️ URL changes each restart (free plan)
- ⚠️ Limited to 40 connections/minute (free plan)

---

### 🔧 **Option 2: SSH Tunnel (Serveo - No Installation)**

**Best for:** Quick testing, no installation needed

1. **Run the server script:**
   ```powershell
   npm run server
   ```
   OR
   ```powershell
   powershell -ExecutionPolicy Bypass -File ./start-server.ps1
   ```

2. **The script will:**
   - Start both servers
   - Create SSH tunnel via serveo.net
   - Display a public URL

3. **Share the URL** shown in the terminal

**Pros:**
- ✅ No installation required
- ✅ Free forever
- ✅ HTTPS enabled

**Cons:**
- ⚠️ Can be less stable
- ⚠️ URL changes each restart
- ⚠️ Requires SSH (built into Windows 10+)

---

### 🏠 **Option 3: Local Network Only (Same WiFi)**

**Best for:** Family members in the same house/network

1. **Start the servers:**
   ```powershell
   npm run dev
   ```
   (In another terminal)
   ```powershell
   node server.js
   ```

2. **Find your local IP:**
   - The script will show it, or run: `ipconfig`
   - Look for "IPv4 Address" (e.g., `192.168.1.100`)

3. **Share the local URL:**
   ```
   http://YOUR_IP:5173
   ```
   Example: `http://192.168.1.100:5173`

**Pros:**
- ✅ Fast connection
- ✅ No external services needed
- ✅ Always works

**Cons:**
- ⚠️ Only works on same WiFi/network
- ⚠️ Not accessible from outside

---

## 🚀 Step-by-Step: Making Your PC a Global Server

### Prerequisites

1. **Windows 10/11** with PowerShell
2. **Node.js** installed (you already have this)
3. **Internet connection**
4. **Keep your PC running** while family uses the app

### Setup Instructions

#### **Method A: Using Ngrok (Recommended)**

1. **Open PowerShell** in the project folder:
   ```powershell
   cd C:\Users\Administrator\.gemini\antigravity\scratch\domining-sibling
   ```

2. **Run the global server:**
   ```powershell
   npm run global
   ```

3. **First time only:** Ngrok will auto-install (takes ~30 seconds)

4. **Copy the public URL** shown (looks like `https://abc123.ngrok-free.app`)

5. **Share with family!** They can access from anywhere

6. **Keep the terminal open** - closing it stops the server

#### **Method B: Using SSH Tunnel**

1. **Open PowerShell** in the project folder

2. **Run:**
   ```powershell
   npm run server
   ```

3. **Look for the public URL** in the output

4. **Share with family!**

---

## 📱 How Family Members Access the App

### From Anywhere in the World:

1. **You share the public URL** (from ngrok or serveo)
   - Example: `https://abc123.ngrok-free.app`

2. **They open it in any browser** (phone, tablet, computer)

3. **They login** with their account

4. **They can use all features!** (Feed, Messages, Student Hub, etc.)

### From Same WiFi/Network:

1. **You share your local IP URL**
   - Example: `http://192.168.1.100:5173`

2. **They connect** (must be on same WiFi)

---

## 🔒 Security Considerations

### ✅ Safe Practices:

- Only share the URL with trusted family members
- Use strong passwords for all accounts
- Keep your PC updated
- Use ngrok (HTTPS) for better security

### ⚠️ Important Notes:

- Your PC must stay on and connected to internet
- If you restart, the public URL may change (free plans)
- Family members will be disconnected if you close the server

---

## 🛠️ Troubleshooting

### Problem: "Ngrok not found"
**Solution:** The script auto-installs it. If it fails:
1. Visit https://ngrok.com/download
2. Download and install manually
3. Run the script again

### Problem: "Port already in use"
**Solution:** 
1. Close any running servers
2. Run: `npm run stop` (if available)
3. Or restart your PC

### Problem: "Cannot connect from outside"
**Solution:**
- Make sure you're using the **public URL** (not localhost)
- Check if your PC is connected to internet
- Try restarting the server script

### Problem: "URL keeps changing"
**Solution:**
- This is normal for free plans
- Upgrade to ngrok paid plan for permanent URL
- Or use a custom domain with Cloudflare Tunnel

---

## 💡 Pro Tips

### For 24/7 Access:
1. **Prevent PC from sleeping:**
   - Settings → System → Power → Never sleep

2. **Auto-start on boot:**
   - Create a scheduled task to run the script on startup

3. **Use a dedicated PC/server** if possible

### For Better Performance:
- Close unnecessary programs
- Ensure good internet connection
- Use wired ethernet instead of WiFi

### For Permanent URL:
- Upgrade to ngrok paid plan ($8/month)
- Or use Cloudflare Tunnel (free, more complex setup)
- Or configure router port forwarding + dynamic DNS

---

## 📊 Monitoring

### Check Server Status:
- **Ngrok Dashboard:** http://localhost:4040
  - See all connections
  - Monitor traffic
  - View request logs

### Check if Servers are Running:
```powershell
# Check backend (should show port 3001)
netstat -ano | findstr :3001

# Check frontend (should show port 5173)
netstat -ano | findstr :5173
```

---

## 🎉 You're All Set!

Your computer is now a standalone server! Family members can access the Domining Sibling app from anywhere in the world using the public URL you share with them.

**Remember:**
- Keep the PowerShell window open
- Keep your PC on and connected
- Share the URL with family
- Enjoy staying connected! 🏠💙

---

## 📞 Quick Reference Commands

```powershell
# Start global server (ngrok)
npm run global

# Start server (SSH tunnel)
npm run server

# Start local only
npm run dev

# Stop all (Ctrl+C in the terminal)
```

---

**Need help?** Check the terminal output for error messages or refer to the troubleshooting section above.
