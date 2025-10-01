#!/bin/bash

# Script to publish both neox.js and create-neox-app packages
# Usage: ./scripts/publish-both.sh

set -e

echo "🚀 Publishing NeoX.js packages..."
echo ""

# Get version from main package.json
VERSION=$(node -p "require('./package.json').version")
echo "📦 Version: $VERSION"
echo ""

# Publish main package (neox.js)
echo "📤 Publishing neox.js@$VERSION..."
npm publish
echo "✅ neox.js published successfully!"
echo ""

# Publish wrapper package (create-neox-app)
echo "📤 Publishing create-neox-app@$VERSION..."
cd create-neox-app-wrapper
npm publish
cd ..
echo "✅ create-neox-app published successfully!"
echo ""

echo "🎉 All packages published successfully!"
echo ""
echo "Users can now run:"
echo "  npx neox.js my-app"
echo "  npx create-neox-app my-app"

