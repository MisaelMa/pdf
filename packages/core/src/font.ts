import type { ResolvedStyle } from './types'

interface FontSource {
  family: string
  src: string | ArrayBuffer | Uint8Array
  fontWeight?: string | number
  fontStyle?: string
}

const registeredFonts = new Map<string, FontSource[]>()

export const Font = {
  register(source: FontSource | FontSource[]): void {
    const sources = Array.isArray(source) ? source : [source]
    for (const s of sources) {
      const existing = registeredFonts.get(s.family) || []
      existing.push(s)
      registeredFonts.set(s.family, existing)
    }
  },

  getRegistered(): Map<string, FontSource[]> {
    return registeredFonts
  },

  clear(): void {
    registeredFonts.clear()
  },
}

export function resolveFontName(style: ResolvedStyle): string {
  const { fontFamily, fontWeight, fontStyle } = style
  const bold =
    fontWeight === 'bold' ||
    (typeof fontWeight === 'number' && fontWeight >= 700)
  const italic = fontStyle === 'italic'

  if (registeredFonts.has(fontFamily)) {
    const sources = registeredFonts.get(fontFamily)!
    const match = sources.find((s) => {
      const sBold =
        s.fontWeight === 'bold' ||
        (typeof s.fontWeight === 'number' && s.fontWeight >= 700)
      const sItalic = s.fontStyle === 'italic'
      return sBold === bold && sItalic === italic
    })
    if (match) return match.src as string
    return sources[0].src as string
  }

  switch (fontFamily) {
    case 'Helvetica':
      if (bold && italic) return 'Helvetica-BoldOblique'
      if (bold) return 'Helvetica-Bold'
      if (italic) return 'Helvetica-Oblique'
      return 'Helvetica'
    case 'Times':
    case 'Times-Roman':
    case 'Times New Roman':
      if (bold && italic) return 'Times-BoldItalic'
      if (bold) return 'Times-Bold'
      if (italic) return 'Times-Italic'
      return 'Times-Roman'
    case 'Courier':
      if (bold && italic) return 'Courier-BoldOblique'
      if (bold) return 'Courier-Bold'
      if (italic) return 'Courier-Oblique'
      return 'Courier'
    case 'Symbol':
      return 'Symbol'
    case 'ZapfDingbats':
      return 'ZapfDingbats'
    default:
      return fontFamily
  }
}

export function registerFontsOnDocument(doc: any): void {
  for (const [family, sources] of registeredFonts) {
    for (const source of sources) {
      if (typeof source.src !== 'string' || !source.src.startsWith('/')) {
        continue
      }
      try {
        doc.registerFont(family, source.src)
      } catch {
        // Font registration may fail if already registered
      }
    }
  }
}
