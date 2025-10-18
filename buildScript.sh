#!/bin/bash
set -e

# Build Chrome
rm -rf dist/chrome
mkdir -p dist/chrome
cp -r src/* dist/chrome/
cp manifests/manifest.chrome.json dist/chrome/manifest.json
echo "✅ Chrome build done."

# Build Firefox
rm -rf dist/firefox
mkdir -p dist/firefox
cp -r src/* dist/firefox/
cp manifests/manifest.firefox.json dist/firefox/manifest.json
echo "✅ Firefox build done."
