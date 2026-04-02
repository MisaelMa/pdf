import type { ResolvedStyle } from './types'

interface FontSource {
  family: string
  src: string | ArrayBuffer | Uint8Array
  fontWeight?: string | number
  fontStyle?: string
}

interface LoadedFont {
  family: string
  src: Buffer | ArrayBuffer | Uint8Array | string
  fontWeight?: string | number
  fontStyle?: string
  loaded: boolean
}

const registeredFonts = new Map<string, LoadedFont[]>()
const fontLoadPromises = new Map<string, Promise<void>>()

export const Font = {
  register(source: FontSource | FontSource[]): void {
    const sources = Array.isArray(source) ? source : [source]
    for (const s of sources) {
      const existing = registeredFonts.get(s.family) || []
      existing.push({
        ...s,
        loaded: typeof s.src !== 'string' || s.src.startsWith('/'),
      })
      registeredFonts.set(s.family, existing)
    }
  },

  getRegistered(): Map<string, LoadedFont[]> {
    return registeredFonts
  },

  clear(): void {
    registeredFonts.clear()
    fontLoadPromises.clear()
  },

  /**
   * Pre-load all registered fonts that have URL sources.
   * Call this before rendering if you've registered fonts with HTTP URLs.
   */
  async load(): Promise<void> {
    const promises: Promise<void>[] = []

    for (const [family, sources] of registeredFonts) {
      for (let i = 0; i < sources.length; i++) {
        const s = sources[i]
        if (s.loaded) continue
        if (typeof s.src !== 'string') continue
        if (s.src.startsWith('/')) { s.loaded = true; continue }

        const key = `${family}-${i}`
        if (fontLoadPromises.has(key)) {
          promises.push(fontLoadPromises.get(key)!)
          continue
        }

        const p = fetch(s.src)
          .then((res) => {
            if (!res.ok) throw new Error(`Failed to load font: ${s.src} (${res.status})`)
            return res.arrayBuffer()
          })
          .then((buf) => {
            s.src = Buffer.from(buf)
            s.loaded = true
          })

        fontLoadPromises.set(key, p)
        promises.push(p)
      }
    }

    await Promise.all(promises)
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
    if (match) return match.family
    return sources[0].family
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
      if (!source.loaded) continue
      try {
        const fontName = family
        if (typeof source.src === 'string') {
          doc.registerFont(fontName, source.src)
        } else {
          doc.registerFont(fontName, source.src as any)
        }
      } catch {
        // Font registration may fail if already registered or invalid
      }
    }
  }
}
