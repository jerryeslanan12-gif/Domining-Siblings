---
description: Share app with AUTO-SERVER (Fixes 'No Host' error)
---

# Global Broadcast (Auto-Server)

I have fixed the issue where the link would say "No Local Host". 

**The New "Share" Command:**
1.  Automatically starts the App Server.
2.  Waiting for it to be ready.
3.  Creates the Tunnel link.

**How to run it:**
1.  **Stop everything** (Ctrl+C in your terminal).
2.  Run:
    ```bash
    npm run share
    ```
3.  **Wait 5 seconds.**
4.  Copy the **`https://....serveo.net`** link (or similar) that appears in green/white text.
5.  Send that to your family!
