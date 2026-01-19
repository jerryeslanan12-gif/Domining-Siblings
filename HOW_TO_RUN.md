# 🚀 HOW TO RUN THE GLOBAL SERVER - SIMPLE GUIDE

## ⚡ Quick Start (Copy & Paste These Commands)

### **Step 1: Open PowerShell**
- Press `Windows Key + X`
- Click "Windows PowerShell" or "Terminal"

### **Step 2: Go to Project Folder**
Copy and paste this command:
```powershell
cd C:\Users\Administrator\.gemini\antigravity\scratch\domining-sibling
```
Press Enter.

### **Step 3: Start the Servers**

#### **Option A: Using the Script (Recommended)**
Copy and paste this command:
```powershell
powershell -ExecutionPolicy Bypass -File .\start-global.ps1
```
Press Enter.

#### **Option B: Manual Start (If Option A doesn't work)**

**Terminal 1 - Start Backend:**
```powershell
cd C:\Users\Administrator\.gemini\antigravity\scratch\domining-sibling
node server.js
```

**Terminal 2 - Start Frontend (open another PowerShell):**
```powershell
cd C:\Users\Administrator\.gemini\antigravity\scratch\domining-sibling
npm run dev
```

**Terminal 3 - Start Ngrok (open another PowerShell):**
```powershell
ngrok http 5173
```

---

## 📱 How to Access

### **On This Computer:**
Open browser and go to:
```
http://localhost:5173
```

### **On Other Devices (Same WiFi):**
Find your IP address (shown in the terminal), then go to:
```
http://YOUR_IP:5173
```
Example: `http://192.168.1.100:5173`

### **From Anywhere in the World (Ngrok):**
Look for the ngrok URL in the terminal (looks like):
```
https://abc123.ngrok-free.app
```

**Copy that URL and share it with family!**

---

## 🎯 What You'll See

When you run the script, you'll see:

```
╔════════════════════════════════════════════════════════╗
║      DOMINING SIBLING - NGROK GLOBAL SERVER           ║
╚════════════════════════════════════════════════════════╝

🖥️  Local Server IP: 192.168.1.100

📡 Step 1: Starting Backend Server (Port 3001)...
🌐 Step 2: Starting Frontend Server (Port 5173)...

✅ Servers are running!

╔════════════════════════════════════════════════════════╗
║           LOCAL NETWORK ACCESS (Same WiFi)            ║
╚════════════════════════════════════════════════════════╝

📱 On this computer:
   http://localhost:5173

📱 On other devices (same WiFi/network):
   http://192.168.1.100:5173

╔════════════════════════════════════════════════════════╗
║         GLOBAL ACCESS (From Anywhere in World)        ║
╚════════════════════════════════════════════════════════╝

🌍 Creating public tunnel with ngrok...

═══════════════════════════════════════════════════════
   ✅ PUBLIC URL READY!
═══════════════════════════════════════════════════════

🌐 Share this link with anyone, anywhere:

   https://abc123.ngrok-free.app

═══════════════════════════════════════════════════════
```

**Copy the URL that appears and share it!**

---

## 🛑 How to Stop

Press `Ctrl + C` in the PowerShell window

---

## 🆘 Troubleshooting

### **"ngrok not found"**
Install ngrok:
1. Visit: https://ngrok.com/download
2. Download and install
3. Run the script again

### **"Port already in use"**
Stop existing servers:
```powershell
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
```

### **"Script won't run"**
Use this command instead:
```powershell
powershell -ExecutionPolicy Bypass -File .\start-global.ps1
```

---

## ✅ That's It!

Once running, you'll have 3 ways to access:

1. **Local**: `http://localhost:5173`
2. **Network**: `http://YOUR_IP:5173`
3. **Global**: `https://abc123.ngrok-free.app` (share this!)

**Keep the PowerShell window open while using the app!**
