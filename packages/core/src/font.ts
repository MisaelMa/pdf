import { StandardFonts, type PDFDocument, type PDFFont } from 'pdf-lib'
import type { ResolvedStyle } from './types'

interface FontSource {
  family: string
  src: string | ArrayBuffer | Uint8Array
  fontWeight?: string | number
  fontStyle?: string
}

interface LoadedFont {
  family: string
  src: ArrayBuffer | Uint8Array | string
  fontWeight?: string | number
  fontStyle?: string
  loaded: boolean
}

const registeredFonts = new Map<string, LoadedFont[]>()
const fontLoadPromises = new Map<string, Promise<void>>()

export const STANDARD_FONT_MAP: Record<string, StandardFonts> = {
  'Helvetica': StandardFonts.Helvetica,
  'Helvetica-Bold': StandardFonts.HelveticaBold,
  'Helvetica-Oblique': StandardFonts.HelveticaOblique,
  'Helvetica-BoldOblique': StandardFonts.HelveticaBoldOblique,
  'Times-Roman': StandardFonts.TimesRoman,
  'Times-Bold': StandardFonts.TimesRomanBold,
  'Times-Italic': StandardFonts.TimesRomanItalic,
  'Times-BoldItalic': StandardFonts.TimesRomanBoldItalic,
  'Courier': StandardFonts.Courier,
  'Courier-Bold': StandardFonts.CourierBold,
  'Courier-Oblique': StandardFonts.CourierOblique,
  'Courier-BoldOblique': StandardFonts.CourierBoldOblique,
  'Symbol': StandardFonts.Symbol,
  'ZapfDingbats': StandardFonts.ZapfDingbats,
}

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
            s.src = new Uint8Array(buf)
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

/**
 * Scan a node tree and collect all font names that will be needed.
 * Accepts a resolveStyle function to avoid circular dependency.
 */
export function collectFontNames(
  node: any,
  resolveStyleFn: (style: any) => ResolvedStyle,
): Set<string> {
  const names = new Set<string>()
  names.add('Helvetica')

  function walk(n: any) {
    if (typeof n === 'string') return
    if (n.props?.style) {
      const style = resolveStyleFn(n.props.style)
      names.add(resolveFontName(style))
    }
    if (n.children) {
      for (const child of n.children) walk(child)
    }
  }

  walk(node)
  return names
}

/**
 * Embed all needed fonts into the pdf-lib document.
 * Returns a map of fontName → PDFFont for use during layout and rendering.
 */
export async function embedAllFonts(
  pdfDoc: PDFDocument,
  fontNames: Set<string>,
): Promise<Map<string, PDFFont>> {
  const fontMap = new Map<string, PDFFont>()

  for (const name of fontNames) {
    const stdEnum = STANDARD_FONT_MAP[name]
    if (stdEnum) {
      fontMap.set(name, await pdfDoc.embedFont(stdEnum))
      continue
    }

    if (registeredFonts.has(name)) {
      const sources = registeredFonts.get(name)!
      const source = sources.find((s) => s.loaded) || sources[0]
      if (source && source.loaded && typeof source.src !== 'string') {
        try {
          fontMap.set(name, await pdfDoc.embedFont(source.src as Uint8Array))
        } catch {
          // Fall back to Helvetica if font embedding fails
        }
      }
    }
  }

  if (!fontMap.has('Helvetica')) {
    fontMap.set('Helvetica', await pdfDoc.embedFont(StandardFonts.Helvetica))
  }

  return fontMap
}

export function getFontFromMap(fontMap: Map<string, PDFFont>, fontName: string): PDFFont {
  return fontMap.get(fontName) || fontMap.get('Helvetica')!
}
