import sketch from 'sketch'

export function importShadows(context: any) {
  const UI = sketch.UI
  const doc = sketch.getSelectedDocument()
  
  // Tailwind Shadow Definitions
  const shadows = [
    {
      name: 'Shadow/sm',
      layers: [
        { x: 0, y: 1, blur: 2, spread: 0, color: '#0000000D' } // rgb(0 0 0 / 0.05)
      ]
    },
    {
      name: 'Shadow/Default',
      layers: [
        { x: 0, y: 1, blur: 3, spread: 0, color: '#0000001A' }, // rgb(0 0 0 / 0.1)
        { x: 0, y: 1, blur: 2, spread: -1, color: '#0000001A' } // rgb(0 0 0 / 0.1)
      ]
    },
    {
      name: 'Shadow/md',
      layers: [
        { x: 0, y: 4, blur: 6, spread: -1, color: '#0000001A' }, // rgb(0 0 0 / 0.1)
        { x: 0, y: 2, blur: 4, spread: -2, color: '#0000001A' } // rgb(0 0 0 / 0.1)
      ]
    },
    {
      name: 'Shadow/lg',
      layers: [
        { x: 0, y: 10, blur: 15, spread: -3, color: '#0000001A' }, // rgb(0 0 0 / 0.1)
        { x: 0, y: 4, blur: 6, spread: -4, color: '#0000001A' } // rgb(0 0 0 / 0.1)
      ]
    },
    {
      name: 'Shadow/xl',
      layers: [
        { x: 0, y: 20, blur: 25, spread: -5, color: '#0000001A' }, // rgb(0 0 0 / 0.1)
        { x: 0, y: 8, blur: 10, spread: -6, color: '#0000001A' } // rgb(0 0 0 / 0.1)
      ]
    },
    {
      name: 'Shadow/2xl',
      layers: [
        { x: 0, y: 25, blur: 50, spread: -12, color: '#00000040' } // rgb(0 0 0 / 0.25)
      ]
    },
    {
      name: 'Shadow/inner',
      inner: true,
      layers: [
        { x: 0, y: 2, blur: 4, spread: 0, color: '#0000000D' } // rgb(0 0 0 / 0.05)
      ]
    },
    {
      name: 'Shadow/none',
      layers: [] // No shadows
    }
  ]

  let count = 0
  
  // Get existing shared styles
  const sharedStyles = doc.sharedLayerStyles
  
  shadows.forEach(shadowDef => {
    // Check if style already exists
    let sharedStyle = sharedStyles.find((s: any) => s.name === shadowDef.name)
    
    const styleData: any = {
      shadows: [],
      innerShadows: [],
      borders: [],
      fills: [
        {
          color: '#ffffff',
          fillType: sketch.Style.FillType.Color,
          enabled: true
        }
      ]
    }

    if (shadowDef.inner) {
      styleData.innerShadows = shadowDef.layers.map(l => ({
        color: l.color,
        x: l.x,
        y: l.y,
        blur: l.blur,
        spread: l.spread,
        enabled: true
      }))
    } else if (shadowDef.layers.length > 0) {
      styleData.shadows = shadowDef.layers.map(l => ({
        color: l.color,
        x: l.x,
        y: l.y,
        blur: l.blur,
        spread: l.spread,
        enabled: true
      }))
    }

    if (sharedStyle) {
      // Update existing style
      sharedStyle.style.shadows = styleData.shadows
      sharedStyle.style.innerShadows = styleData.innerShadows
      // Do NOT overwrite borders and fills to preserve user customizations in the Shared Style
      // sharedStyle.style.borders = styleData.borders
      // sharedStyle.style.fills = styleData.fills
    } else {
      // Create new shared style
      doc.sharedLayerStyles.push({
        name: shadowDef.name,
        style: styleData
      })
    }
    count++
  })

  UI.message(`✅ ${count} sombras Tailwind importadas/atualizadas!`)
}
