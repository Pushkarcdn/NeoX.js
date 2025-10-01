# 🤖 Automated NPM Publishing Setup

## Quick Setup (5 minutes)

### Step 1: Generate NPM Token

Run this command to create an automation token:

```bash
npm token create
```

**Copy the token** that appears - you'll need it for GitHub!

### Step 2: Add Token to GitHub

1. Go to: https://github.com/Pushkarcdn/neox.js/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `NPM_TOKEN`
4. Value: Paste your npm token from Step 1
5. Click **"Add secret"**

### Step 3: You're Done! 🎉

Now whenever you push to `main` branch:
- GitHub Actions will automatically check your version
- If it's a new version → publishes to npm
- If it already exists → skips gracefully

## 📝 How to Publish a New Version

```bash
# Method 1: Automatic version bump
npm version patch    # 1.0.1 → 1.0.2 (bug fixes)
npm version minor    # 1.0.1 → 1.1.0 (new features)
npm version major    # 1.0.1 → 2.0.0 (breaking changes)

# Method 2: Manual version in package.json
# Edit package.json and change "version": "1.0.2"

# Then push to GitHub
git push origin main --follow-tags
```

That's it! The workflow will handle the rest.

## 🔍 Verify It's Working

After pushing:
1. Go to https://github.com/Pushkarcdn/neox.js/actions
2. See the "Publish to NPM" workflow running
3. Check npm: https://www.npmjs.com/package/neox.js

## 📚 More Details

See `.github/PUBLISHING.md` for complete documentation.
