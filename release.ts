/// <reference types="bun-types" />
import fs from 'fs';
import { execSync } from 'child_process';

const pluginName = "Tailwind Colors.sketchplugin";
const zipName = "Tailwind.Colors.sketchplugin.zip";
const appcastFile = ".appcast.json";

interface Appcast {
  versionID?: string;
  downloadFileSize?: number;
  creationDate?: string;
  downloadURL: string;
  [key: string]: any;
}

// 1. Build
console.log('🏗️  Building plugin...');
try {
  execSync('bun build.ts', { stdio: 'inherit' });
} catch (e) {
  console.error('❌ Build failed');
  process.exit(1);
}

// 2. Zip
console.log('📦 Zipping plugin...');
if (fs.existsSync(zipName)) {
  fs.unlinkSync(zipName);
}

try {
  // -r recursive, -y symlinks (important for macos bundles sometimes), -q quiet
  execSync(`zip -r "${zipName}" "${pluginName}"`, { stdio: 'inherit' });
} catch (e) {
  console.error('❌ Zip failed. Make sure you have "zip" installed.');
  process.exit(1);
}

// 3. Update appcast.json
console.log('📝 Updating appcast...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;

let appcast: Appcast = { downloadURL: '' };
if (fs.existsSync(appcastFile)) {
  appcast = JSON.parse(fs.readFileSync(appcastFile, 'utf8'));
}

// Update fields
appcast.versionID = version;
if (fs.existsSync(zipName)) {
    appcast.downloadFileSize = fs.statSync(zipName).size;
}
appcast.creationDate = new Date().toUTCString();

// Replace placeholders in downloadURL if they exist, or update version
// Assuming URL pattern: .../releases/download/vVERSION/Tailwind.Colors.sketchplugin.zip
const urlParts = appcast.downloadURL.split('/');
// Find the part that looks like a version tag (v1.0.0, 1.0.0, etc) or just replace the whole URL structure
// For simplicity, we'll reconstruct the URL using the existing repo info if possible, or just warn the user.

if (appcast.downloadURL.includes('YOUR_GITHUB_USERNAME')) {
  console.warn('⚠️  Please update "downloadURL" in .appcast.json with your actual GitHub username and repo name.');
} else {
  // Try to update the version in the URL
  // Regex to match /v1.0.0/ or /1.0.0/
  // Use simple version number without 'v' prefix to match user's GitHub release convention
  appcast.downloadURL = appcast.downloadURL.replace(/\/v?[\d\.]+\//, `/${version}/`);
}

fs.writeFileSync(appcastFile, JSON.stringify(appcast, null, 2));

console.log(`
✅ Release prepared for version ${version}!

Next steps:
1. Push changes to GitHub:
   git add .
   git commit -m "Release ${version}"
   git push

2. Create a Release on GitHub:
   - Tag: ${version} (WITHOUT 'v' prefix)
   - Title: ${version}
   - Upload "${zipName}" as a binary asset.

3. The plugin will now update automatically for users!
`);
