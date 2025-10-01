# Publishing Guide for NeoX.js

This project publishes **two separate packages** to npm:

1. **`neox.js`** - Main package with all the CLI logic
2. **`create-neox-app`** - Lightweight wrapper that delegates to `neox.js`

This allows users to use either command:

- `npx neox.js my-app`
- `npx create-neox-app my-app`

## 📦 Package Structure

```
neox.js/
├── package.json                    # Main package (neox.js)
├── bin/create-neox-app.js          # Main CLI script
├── template_files/                 # Template files
└── create-neox-app-wrapper/        # Wrapper package
    ├── package.json                # Wrapper package (create-neox-app)
    ├── index.js                    # Delegates to neox.js
    └── README.md
```

## 🔄 Version Management

**IMPORTANT**: Both packages must have the **same version number**.

When updating the version:

1. Update version in `/package.json`
2. Update version in `/create-neox-app-wrapper/package.json`
3. Update the dependency version in wrapper's package.json:
   ```json
   "dependencies": {
     "neox.js": "^0.0.6"  // Match the new version
   }
   ```

## 📤 Publishing

### Option 1: Automatic (GitHub Actions)

Pushing to `main` will automatically publish both packages:

```bash
# 1. Update both package.json files with new version
# 2. Commit and push
git add .
git commit -m "chore: bump version to 0.0.7"
git push origin main
```

The GitHub Actions workflows will:

- `.github/workflows/publish.yml` - Publishes `neox.js`
- `.github/workflows/publish-wrapper.yml` - Publishes `create-neox-app`

### Option 2: Manual Publishing

Use the provided script:

```bash
# Make sure you're logged in to npm
npm login

# Run the publish script
./scripts/publish-both.sh
```

Or publish manually:

```bash
# Publish main package
npm publish

# Publish wrapper package
cd create-neox-app-wrapper
npm publish
cd ..
```

## ✅ Verification

After publishing, verify both packages work:

```bash
# Test neox.js
npx neox.js@latest test-app-1

# Test create-neox-app
npx create-neox-app@latest test-app-2
```

## 🔍 Package Details

### neox.js

- **Package Name**: `neox.js`
- **Contains**: Full CLI implementation, template files
- **Size**: Larger (~few MB with templates)
- **Bin Commands**: `neox`, `create-neox-app`

### create-neox-app

- **Package Name**: `create-neox-app`
- **Contains**: Simple wrapper (index.js)
- **Size**: Tiny (~1KB, depends on neox.js)
- **Bin Commands**: `create-neox-app`

## 🚨 Important Notes

1. **Version Sync**: Always keep versions in sync between both packages
2. **Dependency**: `create-neox-app` depends on `neox.js`, so publish `neox.js` first
3. **Testing**: Test both commands after publishing
4. **NPM Token**: GitHub Actions needs `NPM_TOKEN` secret set in repository settings

## 📝 Checklist Before Publishing

- [ ] Update version in `/package.json`
- [ ] Update version in `/create-neox-app-wrapper/package.json`
- [ ] Update dependency version in wrapper's package.json
- [ ] Test locally if possible
- [ ] Update CHANGELOG.md (if applicable)
- [ ] Commit changes
- [ ] Push to main OR run manual publish script

## 🆘 Troubleshooting

**Problem**: `npx create-neox-app` fails with "Cannot find module 'neox.js'"

**Solution**: Make sure `neox.js` is published first and the version in wrapper's dependencies matches.

---

**Problem**: Version already exists error

**Solution**: Bump the version number in both package.json files.

---

For questions, open an issue on GitHub.
