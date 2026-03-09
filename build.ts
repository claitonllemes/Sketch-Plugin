/// <reference types="bun-types" />
import fs from 'fs';
import path from 'path';

const pluginName = "Tailwind Colors";
const scriptName = "script.js";

const manifest = {
  "name": "Tailwind Colors",
  "description": "Importa todas as cores e sombras oficiais do Tailwind CSS 4 como Color Variables e Layer Styles no documento",
  "author": "Claiton Lemes",
  "authorEmail": "contato@claitonlemes.com.br",
  "homepage": "",
  "version": "1.3.0",
  "identifier": "tailwind-colors",
  "appcast": "https://raw.githubusercontent.com/claitonllemes/Sketch-Plugin/main/.appcast.json",
  "compatibleVersion": "70",
  "icon": "icon.png",
  "commands": [
    {
      "name": "❇️ Importar Tudo",
      "identifier": "tailwind-colors.import-all",
      "script": "script.js",
      "shortcut": "ctrl shift t",
      "handler": "onImportAll"
    },
    {
      "name": "🔘 Importar Cores",
      "identifier": "tailwind-colors.import-colors",
      "script": "script.js",
      "handler": "onImportColors"
    },
    {
      "name": "🔘 Importar Sombras",
      "identifier": "tailwind-colors.import-shadows",
      "script": "script.js",
      "handler": "onImportShadows"
    }
  ],
  "menu": {
    "title": "Tailwind Colors",
    "items": [
      "tailwind-colors.import-all",
      "-",
      "tailwind-colors.import-colors",
      "tailwind-colors.import-shadows"
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
      // Handles: import sketch from 'sketch' OR import sketch2 from 'sketch'
      content = content.replace(/import\s+(\w+)\s+from\s+['"]sketch['"];?/g, 'var $1 = require("sketch");');
      
      // Remove ESM exports
      content = content.replace(/export\s+\{[\s\S]*?\};?/g, '');
      content = content.replace(/export\s+default\s+[\w_]+;?/g, '');
      
      fs.writeFileSync(scriptPath, content);
      console.log('Fixed imports for Sketch compatibility');
      
      console.log('Plugin created successfully!');
    }
  });

} catch (err) {
  console.error('Error creating plugin structure:', err);
}
