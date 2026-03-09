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
  "version": "1.1.0",
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
  }).then(result => {
    if (!result.success) {
      console.error("Build failed");
      for (const message of result.logs) {
        console.error(message);
      }
    } else {
      console.log(`Created ${scriptName} from src/main.ts`);
      console.log('Plugin created successfully!');
    }
  });

} catch (err) {
  console.error('Error creating plugin structure:', err);
}
