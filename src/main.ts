import sketch from 'sketch'
import { importColors } from './colors'
import { importShadows } from './shadows'

export function onImportColors(context: any) {
  importColors(context)
}

export function onImportShadows(context: any) {
  importShadows(context)
}

export function onImportAll(context: any) {
  importColors(context)
  importShadows(context)
  sketch.UI.message('✅ Cores e Sombras Tailwind importadas com sucesso!')
}

// Default export for safety if needed, though named exports are better for handlers
export default onImportAll

declare global {
  var onImportColors: (context: any) => void;
  var onImportShadows: (context: any) => void;
  var onImportAll: (context: any) => void;
}

globalThis.onImportColors = onImportColors;
globalThis.onImportShadows = onImportShadows;
globalThis.onImportAll = onImportAll;
