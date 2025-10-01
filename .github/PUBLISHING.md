# 📦 Automated NPM Publishing Guide

This repository is configured to automatically publish to npm when you push to the `main` branch.

## 🔧 Setup Instructions

### 1. Get Your NPM Access Token

```bash
# Login to npm (if not already logged in)
npm login

# Generate an automation token (recommended for CI/CD)
# Go to: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
# Click "Generate New Token" → "Automation" → Copy the token
```

**Or via CLI:**

```bash
npm token create --read-only=false
```

### 2. Add NPM Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click **Add secret**

### 3. How It Works

The GitHub Action will:

1. ✅ Trigger on every push to `main` branch (except README, LICENSE changes)
2. ✅ Check the version in `package.json`
3. ✅ Compare with the version published on npm
4. ✅ If the version is new → Publish to npm
5. ✅ Create a git tag for the release (e.g., `v1.0.2`)
6. ✅ Skip if the version already exists

### 4. Publishing Workflow

```bash
# 1. Make your changes
git add .
git commit -m "feat: add new feature"

# 2. Update version (this is important!)
npm version patch  # for bug fixes (1.0.1 → 1.0.2)
npm version minor  # for new features (1.0.1 → 1.1.0)
npm version major  # for breaking changes (1.0.1 → 2.0.0)

# 3. Push to GitHub (this triggers the workflow)
git push origin main --follow-tags
```

### 5. Version Bump Commands

```bash
# Patch release (bug fixes)
npm version patch -m "fix: bug fixes"

# Minor release (new features, backward compatible)
npm version minor -m "feat: new features"

# Major release (breaking changes)
npm version major -m "BREAKING CHANGE: major update"

# Push with tags
git push origin main --follow-tags
```

## 🎯 Best Practices

1. **Always bump version before pushing** - The workflow only publishes if the version is new
2. **Use semantic versioning** - Follow semver (MAJOR.MINOR.PATCH)
3. **Write meaningful commit messages** - Use conventional commits
4. **Test locally first** - Make sure everything works before pushing
5. **Check Actions tab** - Monitor the publishing workflow in GitHub Actions

## 📊 Monitoring

- Check the **Actions** tab in your GitHub repository
- View logs for each publish attempt
- Verify on npm: https://www.npmjs.com/package/neox.js

## 🔍 Troubleshooting

### Issue: NPM_TOKEN not working

**Solution:** Make sure you created an **Automation** token, not a **Read-only** token

### Issue: Version already exists

**Solution:** Bump your version using `npm version patch/minor/major`

### Issue: Permission denied

**Solution:** Verify you're logged in as the package owner on npm

### Issue: Workflow not triggering

**Solution:** Check if you pushed to the `main` branch and didn't just change README/LICENSE

## 🚀 Quick Reference

```bash
# Standard workflow
npm version patch
git push origin main --follow-tags

# Check if version exists on npm
npm view neox.js versions

# Manual publish (if needed)
npm publish
```

## 📝 Notes

- The workflow automatically creates git tags (e.g., `v1.0.2`)
- Tags are pushed to GitHub after successful publish
- Failed publishes don't create tags
- Duplicate version publishes are skipped gracefully
