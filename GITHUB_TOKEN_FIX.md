# 🔧 How to Fix GitHub Token Permission Issue

## Problem
When trying to push workflow files to GitHub, you get this error:
```
! [remote rejected] main -> main (refusing to allow a Personal Access Token to 
create or update workflow `.github/workflows/cd.yml` without `workflow` scope)
```

## Why This Happens
GitHub requires a Personal Access Token (PAT) with the **`workflow`** scope to create or modify files in `.github/workflows/`. This is a security measure to prevent unauthorized workflow modifications.

---

## ✅ Solution: Create New GitHub Token with Workflow Scope

### Step 1: Go to GitHub Token Settings
1. Open your browser and go to: https://github.com/settings/tokens
2. Or navigate manually:
   - Click your profile picture (top right)
   - Settings → Developer settings → Personal access tokens → Tokens (classic)

### Step 2: Generate New Token
1. Click **"Generate new token"** → **"Generate new token (classic)"**
2. Give it a descriptive name: `DHS Project - Workflow Access`
3. Set expiration: Choose based on your preference (30 days, 60 days, or No expiration)

### Step 3: Select Required Scopes
**IMPORTANT:** Check these scopes:

✅ **repo** (Full control of private repositories)
   - This includes: repo:status, repo_deployment, public_repo, repo:invite, security_events

✅ **workflow** (Update GitHub Action workflows)
   - This is the critical one for pushing workflow files

Optional but recommended:
- ✅ **read:org** (if working with organization repos)

### Step 4: Generate and Copy Token
1. Scroll down and click **"Generate token"**
2. **IMPORTANT:** Copy the token immediately (you won't see it again!)
3. Save it somewhere secure temporarily

---

## 🔄 Update Git Credentials

### Option A: Update via Command Line (Recommended)

#### For macOS:
```bash
# Remove old credential
git credential-osxkeychain erase
host=github.com
protocol=https

# Push will prompt for new credentials
git push origin main
# Username: your-github-username
# Password: paste-your-new-token-here
```

#### For Linux:
```bash
# Update credential helper
git config --global credential.helper store

# Push will prompt for credentials
git push origin main
# Username: your-github-username
# Password: paste-your-new-token-here
```

#### For Windows:
```bash
# Update credential manager
git credential-manager-core erase https://github.com

# Push will prompt for credentials
git push origin main
# Username: your-github-username
# Password: paste-your-new-token-here
```

### Option B: Update Remote URL with Token

```bash
# Update remote URL to include token
git remote set-url origin https://YOUR_TOKEN@github.com/anushkakumbhar2011/stellar-dhs-health-dapp.git

# Now push
git push origin main
```

**⚠️ Warning:** This stores the token in plain text in `.git/config`. Use Option A for better security.

---

## 📝 Commit and Push Workflows

Once your token is updated:

```bash
# Verify files are staged
git status

# Commit the workflows
git commit -m "feat: add production-ready CI/CD workflows

- Add CI workflow with frontend and smart contract builds
- Add CD workflow for deployment preparation
- Restore CI/CD badges in README
- Workflows include caching, artifacts, and build verification"

# Push to GitHub
git push origin main
```

---

## ✅ Verify Everything Works

### 1. Check GitHub Actions Tab
- Go to: https://github.com/anushkakumbhar2011/stellar-dhs-health-dapp/actions
- You should see the CI workflow running
- Wait for it to complete (green checkmark)

### 2. Check Badges in README
- Go to: https://github.com/anushkakumbhar2011/stellar-dhs-health-dapp
- The CI and CD badges should now show status (green = passing)

### 3. Verify Workflow Files
- Go to: https://github.com/anushkakumbhar2011/stellar-dhs-health-dapp/tree/main/.github/workflows
- You should see `ci.yml` and `cd.yml`

---

## 🎯 What the Workflows Do

### CI Workflow (`ci.yml`)
**Triggers:** Push or PR to main/develop branches

**Jobs:**
1. **Frontend Build**
   - Installs Node.js 20
   - Runs `npm ci` to install dependencies
   - Runs ESLint for code quality
   - Builds production bundle with `npm run build`
   - Verifies `dist/` directory exists
   - Uploads build artifact (7-day retention)

2. **Smart Contract Build**
   - Sets up Rust toolchain
   - Adds wasm32-unknown-unknown target
   - Runs cargo fmt and clippy checks
   - Builds Soroban contract to WASM
   - Verifies WASM output
   - Uploads WASM artifact (7-day retention)

3. **CI Success Check**
   - Ensures both jobs passed
   - Provides final summary

### CD Workflow (`cd.yml`)
**Triggers:** Push to main branch only

**Jobs:**
1. **Build & Prepare Deployment**
   - Builds production-ready bundle
   - Verifies all critical files exist
   - Uploads artifact (30-day retention)
   - Generates deployment summary

2. **Deployment Notification**
   - Confirms build is ready
   - Provides deployment instructions
   - Lists deployment options (Vercel, Netlify, custom)

---

## 🔒 Security Best Practices

1. **Never commit tokens to git**
   - Tokens should only be in GitHub Secrets or local credential storage

2. **Use minimal scopes**
   - Only enable `repo` and `workflow` scopes
   - Don't enable admin or delete permissions unless needed

3. **Set expiration dates**
   - Use 30-60 day expiration for better security
   - Rotate tokens regularly

4. **Revoke old tokens**
   - After creating new token, revoke the old one
   - Go to: https://github.com/settings/tokens

---

## 🆘 Troubleshooting

### Issue: "Authentication failed"
**Solution:** Make sure you're using the token as the password, not your GitHub password

### Issue: "Permission denied"
**Solution:** Verify the token has both `repo` and `workflow` scopes enabled

### Issue: "Token not found"
**Solution:** The token might have expired. Generate a new one

### Issue: Workflows not running
**Solution:** 
1. Check Actions tab is enabled: Settings → Actions → General
2. Verify workflow files are in `.github/workflows/`
3. Check workflow syntax with: https://rhysd.github.io/actionlint/

---

## 📚 Additional Resources

- [GitHub Personal Access Tokens Documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

## ✅ Quick Checklist

- [ ] Created new GitHub token with `repo` + `workflow` scopes
- [ ] Copied token to secure location
- [ ] Updated git credentials (Option A or B)
- [ ] Committed workflow files
- [ ] Pushed to GitHub successfully
- [ ] Verified workflows appear in Actions tab
- [ ] Checked badges show status in README
- [ ] Revoked old token (optional but recommended)

---

**Need help?** Check the GitHub Actions tab for detailed error logs if workflows fail.
