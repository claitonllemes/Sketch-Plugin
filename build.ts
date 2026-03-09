/// <reference types="bun-types" />
import fs from 'fs';
import path from 'path';

const pluginName = "Tailwind Colors";
const scriptName = "script.js";

const manifest = {
  "name": "Tailwind Colors",
  "description": "Importa todas as cores oficiais do Tailwind CSS 4 como Color Variables no documento",
  "author": "Claiton Lemes",
  "authorEmail": "contato@claitonlemes.com.br",
  "homepage": "",
  "version": "1.2.0",
  "identifier": "tailwind-colors",
  "appcast": "https://raw.githubusercontent.com/claitonllemes/Sketch-Plugin/main/.appcast.json",
  "compatibleVersion": "70",
  "icon": "icon.png",
  "commands": [
    {
      "name": "Importar Tailwind Colors",
      "identifier": "tailwind-colors.import",
      "script": "script.js",
      "shortcut": "ctrl shift t",
      "handler": "onRun"
    }
  ],
  "menu": {
    "title": "Tailwind Colors",
    "items": [
      "tailwind-colors.import"
    ]
  }
};

const pluginDir = `${pluginName}.sketchplugin`;
const sketchDir = path.join(pluginDir, 'Contents', 'Sketch');
const resourcesDir = path.join(pluginDir, 'Contents', 'Resources');

console.log(`Creating plugin structure at ${pluginDir}...`);

try {
  fs.mkdirSync(sketchDir, { recursive: true });
  fs.mkdirSync(resourcesDir, { recursive: true });

  // Write manifest
  fs.writeFileSync(path.join(sketchDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('Created manifest.json');

  // Copy icon if exists
  if (fs.existsSync('icon.png')) {
    fs.copyFileSync('icon.png', path.join(resourcesDir, 'icon.png'));
    console.log('Copied icon.png');
  } else {
    console.warn('Warning: icon.png not found in current directory.');
  }

  // Build TypeScript
  console.log('Building TypeScript source...');
  Bun.build({
    entrypoints: ['./src/main.ts'],
    outdir: sketchDir,
    naming: scriptName,
    target: 'browser',
    external: ['sketch'],
  }).then(async result => {
    if (!result.success) {
      console.error("Build failed");
      for (const message of result.logs) {
        console.error(message);
      }
    } else {
      console.log(`Created ${scriptName} from src/main.ts`);
      
      // Post-process to fix Sketch compatibility
      const scriptPath = path.join(sketchDir, scriptName);
      let content = fs.readFileSync(scriptPath, 'utf8');
      
      // Replace ESM import with CommonJS require
      content = content.replace(/import\s+sketch\s+from\s+['"]sketch['"];?/g, 'var sketch = require("sketch");');
      
      // Ensure onRun is exposed properly if needed, but globalThis.onRun is usually fine.
      // However, sometimes Sketch prefers explicit var at top level if it's a simple script.
      // But let's trust globalThis for now or add a fallback.
      
      fs.writeFileSync(scriptPath, content);
      console.log('Fixed imports for Sketch compatibility');
      
      console.log('Plugin created successfully!');
    }
  });

} catch (err) {
  console.error('Error creating plugin structure:', err);
}
