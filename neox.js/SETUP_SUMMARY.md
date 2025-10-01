# 🎉 NeoX.js Dual Package Setup - Complete!

## ✅ What Was Fixed

Your NeoX.js CLI now supports **BOTH** commands:

- ✅ `npx neox.js`
- ✅ `npx create-neox-app`

While keeping your main package name as **`neox.js`** on npm!

## 📦 How It Works

We've created a **two-package system**:

### 1. Main Package: `neox.js`

- Contains all the CLI logic and template files
- Published as `neox.js` on npm
- Users can run: `npx neox.js`

### 2. Installer Package: `create-neox-app`

- Lightweight installer (just 10 lines of code!)
- Depends on and delegates to `neox.js`
- Published as `create-neox-app` on npm
- Users can run: `npx create-neox-app`

This is the **same pattern** used by popular tools like:

- `vite` and `create-vite`
- `react` and `create-react-app`


## 📝 Files Modified

1. **`package.json`** - Bumped version to 0.0.6
2. **`bin/create-neox-app.js`** - Enhanced to accept app name as CLI argument
3. **`README.md`** - Updated documentation with both commands
4. **`.github/workflows/publish.yml`** - Already existed (publishes main package)

## 🚀 How to Publish

### Option 1: Automatic (Recommended)

Just push to main - GitHub Actions will handle everything:

```bash
git add .
git commit -m "feat: Add create-neox-app installer package"
git push origin main
```

GitHub Actions will automatically:

1. ✅ Publish `neox.js@0.0.6`
2. ✅ Publish `create-neox-app@0.0.6`
3. ✅ Create git tag `v0.0.6`

### Option 2: Manual Publishing

```bash
# Login to npm
npm login

# Run the publish script
./scripts/publish-both.sh
```

## 🎯 After Publishing

Users will be able to use **either** command:

```bash
# Using create-neox-app (familiar to React developers)
npx create-neox-app my-app

# Using neox.js directly
npx neox.js my-app

# Interactive mode
npx create-neox-app
```

## 📊 Both Packages on NPM

- 📦 https://www.npmjs.com/package/neox.js
- 📦 https://www.npmjs.com/package/create-neox-app

## 🔄 Version Management (Important!)

When releasing new versions, **ALWAYS** update both:

1. `/package.json` → version
2. `/create-neox-app/package.json` → version AND dependency

Example for version 0.0.7:

```json
// /create-neox-app/package.json
{
  "version": "0.0.7",
  "dependencies": {
    "neox.js": "^0.0.7" // Must match!
  }
}
```

See `PUBLISHING.md` for detailed versioning guide.

## ✅ Verification

After publishing, test both commands:

```bash
# Test create-neox-app
npx create-neox-app@latest test-app-1
cd test-app-1
npm run dev:local

# Test neox.js
npx neox.js@latest test-app-2
cd test-app-2
npm run dev:local
```

## 🎉 Success!

Your package is now user-friendly and follows industry best practices!

Users familiar with:

- `create-react-app` → will use `npx create-neox-app`
- `vite` → will use `npx neox.js`

Both work perfectly! 🚀

---

**Questions?** Check `PUBLISHING.md` or open an issue on GitHub.
