# How to Push this Repository to GitHub

Your project has been successfully initialized as a local Git repository!
Follow these steps to upload it to your GitHub account.

## Step 1: Create a GitHub Repository
1. Go to **[github.com/new](https://github.com/new)**.
2. Name your repository (e.g., `domining-sibling`).
3. **Important**: Do NOT check "Initialize with README", "Add .gitignore", or "Add license". (We already have these).
4. Click **Create repository**.

## Step 2: Link Your Local Repo
Copy the commands shown on GitHub under "…or push an existing repository from the command line", which look like this:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/domining-sibling.git
git branch -M main
git push -u origin main
```

## Step 3: Run the Commands
Open your terminal in this folder and paste the commands you copied.

1. **Add Remote**:
   ```powershell
   & "C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/YOUR_USERNAME/domining-sibling.git
   ```
   *(Replace URL with your actual repo URL)*

2. **Push Code**:
   ```powershell
   & "C:\Program Files\Git\cmd\git.exe" push -u origin main
   ```

3. **Log In**:
   - A window will pop up asking you to log in to GitHub.
   - Follow the prompt to authorize.

## ✅ Done!
Your code is now safe on GitHub.
To save future changes, just run:
```powershell
& "C:\Program Files\Git\cmd\git.exe" add .
& "C:\Program Files\Git\cmd\git.exe" commit -m "Describe your changes"
& "C:\Program Files\Git\cmd\git.exe" push
```
