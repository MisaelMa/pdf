import {
  PDFDocument, PDFName, PDFString, PDFArray, rgb, type PDFPage, type PDFFont, type PDFImage,
  pushGraphicsState, popGraphicsState, moveTo, lineTo, appendBezierCurve,
  closePath, fill, stroke, fillAndStroke, setLineWidth, setFillingColor, setStrokingColor,
} from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import type { PDFNode, PDFChild, LayoutNode, ResolvedStyle } from './types'
import { resolvePageSize } from './page-sizes'
import { resolveStyle } from './stylesheet'
import { resolveFontName, collectFontNames, embedAllFonts, getFontFromMap, Font } from './font'
import { fetchImage } from './image-loader'
import { initYoga, buildYogaTree, wrapText } from './yoga-layout'

export async function renderToBuffer(documentNode: PDFNode): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)

  const props = documentNode.props
  if (props.title) pdfDoc.setTitle(props.title)
  if (props.author) pdfDoc.setAuthor(props.author)
  if (props.subject) pdfDoc.setSubject(props.subject)
  if (props.keywords) pdfDoc.setKeywords(typeof props.keywords === 'string' ? [props.keywords] : props.keywords)
  if (props.creator) pdfDoc.setCreator(props.creator)
  if (props.producer) pdfDoc.setProducer(props.producer)
  if (props.language) pdfDoc.setLanguage(props.language)

  await Font.load()
  const fontNames = collectFontNames(documentNode, resolveStyle)
  const fontMap = await embedAllFonts(pdfDoc, fontNames)
  const yg = await initYoga()

  for (const child of documentNode.children) {
    if (typeof child === 'string') continue
    if (child.type === 'PAGE') {
      await renderPage(pdfDoc, child, yg, fontMap)
    }
  }

  return pdfDoc.save()
}

export async function renderToBlob(documentNode: PDFNode): Promise<Blob> {
  const bytes = await renderToBuffer(documentNode)
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })
}

export async function renderToStream(documentNode: PDFNode): Promise<ReadableStream<Uint8Array>> {
  const bytes = await renderToBuffer(documentNode)
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(bytes))
      controller.close()
    },
  })
}

export async function renderToFile(documentNode: PDFNode, filePath: string): Promise<void> {
  const buffer = await renderToBuffer(documentNode)
  const mod = 'fs/promises'
  const { writeFile } = await (Function('m', 'return import(m)')(mod))
  await writeFile(filePath, buffer)
}

// ── Image handling ──────────────────────────────────────────────────

const loadedImages = new Map<string, Uint8Array>()

async function preloadImages(node: PDFNode): Promise<void> {
  const promises: Promise<void>[] = []

  function walk(n: PDFChild) {
    if (typeof n === 'string') return
    if (n.type === 'IMAGE' && n.props.src) {
      const src = n.props.src
      if (typeof src === 'string' && !loadedImages.has(src)) {
        promises.push(
          fetchImage(src)
            .then((buf) => { loadedImages.set(src, new Uint8Array(buf)) })
            .catch(() => {}),
        )
      }
    }
    for (const child of n.children) walk(child)
  }

  walk(node)
  await Promise.all(promises)
}

function detectImageType(data: Uint8Array): 'png' | 'jpg' | null {
  if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4E && data[3] === 0x47) return 'png'
  if (data[0] === 0xFF && data[1] === 0xD8 && data[2] === 0xFF) return 'jpg'
  return null
}

const embeddedImages = new Map<string, PDFImage>()

async function embedImage(pdfDoc: PDFDocument, src: string | ArrayBuffer | Uint8Array): Promise<PDFImage | null> {
  const key = typeof src === 'string' ? src : ''
  if (key && embeddedImages.has(key)) return embeddedImages.get(key)!

  let data: Uint8Array
  if (typeof src === 'string') {
    const cached = loadedImages.get(src)
    if (!cached) return null
    data = cached
  } else if (src instanceof ArrayBuffer) {
    data = new Uint8Array(src)
  } else {
    data = src
  }

  let image: PDFImage | null = null
  const type = detectImageType(data)
  try {
    if (type === 'png') image = await pdfDoc.embedPng(data)
    else if (type === 'jpg') image = await pdfDoc.embedJpg(data)
    else {
      try { image = await pdfDoc.embedPng(data) } catch { image = await pdfDoc.embedJpg(data) }
    }
  } catch {
    return null
  }

  if (key && image) embeddedImages.set(key, image)
  return image
}

// ── Color parsing ───────────────────────────────────────────────────

function parseColor(color: string) {
  if (color.startsWith('#')) {
    const hex = color.length === 4
      ? color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
      : color.slice(1)
    const r = parseInt(hex.slice(0, 2), 16) / 255
    const g = parseInt(hex.slice(2, 4), 16) / 255
    const b = parseInt(hex.slice(4, 6), 16) / 255
    return rgb(r, g, b)
  }
  return rgb(0, 0, 0)
}

// ── Page rendering with Yoga layout + wrap ─────────────────────────

async function renderPage(
  pdfDoc: PDFDocument,
  pageNode: PDFNode,
  yg: any,
  fontMap: Map<string, PDFFont>,
): Promise<void> {
  const size = resolvePageSize(pageNode.props.size, pageNode.props.orientation)
  const pageStyle = resolveStyle(pageNode.props.style)
  const wrapEnabled = pageNode.props.wrap !== false

  await preloadImages(pageNode)
  const layouts = buildYogaTree(yg, fontMap, pageNode, size.width, size.height)

  if (!wrapEnabled) {
    const page = addNewPage(pdfDoc, size, pageStyle)
    for (const layout of layouts) await renderLayoutNode(pdfDoc, page, layout, fontMap, size.height)
    return
  }

  const flatNodes = flattenForWrapping(layouts)

  if (flatNodes.length === 0) {
    addNewPage(pdfDoc, size, pageStyle)
    return
  }

  const totalContentHeight = flatNodes.reduce((max, n) => Math.max(max, n.y + n.height), 0)

  if (totalContentHeight <= size.height) {
    const page = addNewPage(pdfDoc, size, pageStyle)
    for (const layout of layouts) await renderLayoutNode(pdfDoc, page, layout, fontMap, size.height)
    return
  }

  let pageStartY = 0
  let pageIndex = 0

  while (pageStartY < totalContentHeight) {
    const pageEndY = pageStartY + size.height
    const page = addNewPage(pdfDoc, size, pageStyle)

    for (const node of flatNodes) {
      if (node.node.type === 'PAGE') continue
      if (node.y + node.height <= pageStartY || node.y >= pageEndY) continue
      const offsetNode = { ...node, y: node.y - pageStartY, children: [] }
      await renderLayoutNode(pdfDoc, page, offsetNode, fontMap, size.height)
    }

    pageStartY = pageEndY
    if (++pageIndex > 100) break
  }
}

function addNewPage(
  pdfDoc: PDFDocument,
  size: { width: number; height: number },
  pageStyle: ResolvedStyle,
): PDFPage {
  const page = pdfDoc.addPage([size.width, size.height])
  if (pageStyle.backgroundColor) {
    page.drawRectangle({ x: 0, y: 0, width: size.width, height: size.height, color: parseColor(pageStyle.backgroundColor) })
  }
  return page
}

function flattenForWrapping(layouts: LayoutNode[]): LayoutNode[] {
  const result: LayoutNode[] = []
  function walk(layout: LayoutNode) {
    const hasVisual = layout.textContent || layout.node.type === 'IMAGE' || layout.style.backgroundColor || layout.style.borderWidth > 0
    if (hasVisual) result.push(layout)
    if (layout.node.type === 'LINK' && layout.node.props.src && !hasVisual) result.push(layout)
    for (const child of layout.children) walk(child)
  }
  for (const layout of layouts) walk(layout)
  return result
}

// ── Render pass ─────────────────────────────────────────────────────

async function renderLayoutNode(
  pdfDoc: PDFDocument,
  page: PDFPage,
  layout: LayoutNode,
  fontMap: Map<string, PDFFont>,
  pageHeight: number,
): Promise<void> {
  const { x, y, width, height, style, node, children, textContent } = layout

  if (node.type === 'PAGE') {
    for (const child of children) await renderLayoutNode(pdfDoc, page, child, fontMap, pageHeight)
    return
  }

  const pdfY = pageHeight - y - height

  if (style.backgroundColor || style.borderWidth > 0) {
    const bgColor = style.backgroundColor ? parseColor(style.backgroundColor) : undefined
    const bdColor = style.borderWidth > 0 ? parseColor(style.borderColor) : undefined

    if (style.borderRadius > 0) {
      drawRoundedRect(page, x, pdfY, width, height, style.borderRadius, bgColor, bdColor, style.borderWidth, style.borderStyle)
    } else {
      if (bgColor) {
        page.drawRectangle({ x, y: pdfY, width, height, color: bgColor, borderWidth: 0 })
      }
      if (style.borderWidth > 0 && bdColor) {
        page.drawRectangle({ x, y: pdfY, width, height, borderColor: bdColor, borderWidth: style.borderWidth })
      }
    }
  }

  if (node.type === 'TEXT' && textContent) renderText(page, layout, fontMap, pageHeight)

  if (node.type === 'LINK') {
    if (textContent) renderText(page, layout, fontMap, pageHeight)
    if (node.props.src) addLinkAnnotation(pdfDoc, page, x, pdfY, width, height, node.props.src)
  }

  if (node.type === 'IMAGE' && node.props.src) {
    await renderImage(pdfDoc, page, layout, pageHeight)
  }

  for (const child of children) await renderLayoutNode(pdfDoc, page, child, fontMap, pageHeight)
}

function renderText(
  page: PDFPage,
  layout: LayoutNode,
  fontMap: Map<string, PDFFont>,
  pageHeight: number,
): void {
  const { x, y, width, style, textContent } = layout
  if (!textContent) return

  const fontName = resolveFontName(style)
  const font = getFontFromMap(fontMap, fontName)
  const fontSize = style.fontSize
  const lineGap = style.lineHeight ? (style.lineHeight - 1) * fontSize : 0

  let color = parseColor(style.color)
  if (layout.node.type === 'LINK' && style.color === '#000000') color = parseColor('#0000EE')

  const cX = x + style.paddingLeft
  const cW = width - style.paddingLeft - style.paddingRight
  const cTopY = y + style.paddingTop

  const lines = wrapText(font, textContent, fontSize, Math.max(cW, 0))
  const baseLineHeight = font.heightAtSize(fontSize)
  const effectiveLineHeight = baseLineHeight + lineGap

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineTopY = cTopY + i * effectiveLineHeight

    let lineX = cX
    if (style.textAlign === 'center') {
      lineX = cX + (cW - font.widthOfTextAtSize(line, fontSize)) / 2
    } else if (style.textAlign === 'right') {
      lineX = cX + cW - font.widthOfTextAtSize(line, fontSize)
    }

    const pdfBaselineY = pageHeight - lineTopY - font.heightAtSize(fontSize, { descender: false })

    page.drawText(line, { x: lineX, y: pdfBaselineY, size: fontSize, font, color, opacity: style.opacity })
  }
}

function addLinkAnnotation(
  pdfDoc: PDFDocument,
  page: PDFPage,
  x: number,
  y: number,
  w: number,
  h: number,
  uri: string,
): void {
  const context = pdfDoc.context
  const annot = context.register(
    context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [x, y, x + w, y + h],
      Border: [0, 0, 0],
      A: { Type: 'Action', S: 'URI', URI: PDFString.of(uri) },
    }),
  )

  const existing = page.node.lookup(PDFName.of('Annots')) as PDFArray | undefined
  if (existing instanceof PDFArray) {
    existing.push(annot)
  } else {
    page.node.set(PDFName.of('Annots'), context.obj([annot]))
  }
}

async function renderImage(
  pdfDoc: PDFDocument,
  page: PDFPage,
  layout: LayoutNode,
  pageHeight: number,
): Promise<void> {
  const { x, y, width, height, style, node } = layout
  const cX = x + style.paddingLeft
  const cY = y + style.paddingTop
  const cW = width - style.paddingLeft - style.paddingRight
  const cH = height - style.paddingTop - style.paddingBottom

  const image = await embedImage(pdfDoc, node.props.src)
  if (!image) return

  let drawW = cW, drawH = cH, drawX = cX, drawY = cY

  if (style.objectFit === 'contain') {
    const imgAspect = image.width / image.height
    const boxAspect = cW / cH
    if (imgAspect > boxAspect) {
      drawW = cW; drawH = cW / imgAspect; drawY = cY + (cH - drawH) / 2
    } else {
      drawH = cH; drawW = cH * imgAspect; drawX = cX + (cW - drawW) / 2
    }
  } else if (style.objectFit === 'cover') {
    const imgAspect = image.width / image.height
    const boxAspect = cW / cH
    if (imgAspect > boxAspect) {
      drawH = cH; drawW = cH * imgAspect; drawX = cX + (cW - drawW) / 2
    } else {
      drawW = cW; drawH = cW / imgAspect; drawY = cY + (cH - drawH) / 2
    }
  }

  page.drawImage(image, { x: drawX, y: pageHeight - drawY - drawH, width: drawW, height: drawH, opacity: style.opacity })
}

// ── Rounded rectangle with bezier curves ────────────────────────────

const K = 0.5522847498 // cubic bezier approximation for quarter circle

function drawRoundedRect(
  page: PDFPage,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  fillRgb?: ReturnType<typeof rgb>,
  strokeRgb?: ReturnType<typeof rgb>,
  strokeWidth?: number,
  strokeStyle?: string,
): void {
  const r = Math.min(radius, w / 2, h / 2)
  const kr = r * K

  const pathOps = [
    moveTo(x + r, y),
    lineTo(x + w - r, y),
    appendBezierCurve(x + w - r + kr, y, x + w, y + r - kr, x + w, y + r),
    lineTo(x + w, y + h - r),
    appendBezierCurve(x + w, y + h - r + kr, x + w - r + kr, y + h, x + w - r, y + h),
    lineTo(x + r, y + h),
    appendBezierCurve(x + r - kr, y + h, x, y + h - r + kr, x, y + h - r),
    lineTo(x, y + r),
    appendBezierCurve(x, y + r - kr, x + r - kr, y, x + r, y),
    closePath(),
  ]

  page.pushOperators(pushGraphicsState())

  if (fillRgb && strokeRgb && strokeWidth) {
    page.pushOperators(
      setLineWidth(strokeWidth),
      setFillingColor(fillRgb),
      setStrokingColor(strokeRgb),
      ...pathOps,
      fillAndStroke(),
    )
  } else if (fillRgb) {
    page.pushOperators(
      setFillingColor(fillRgb),
      ...pathOps,
      fill(),
    )
  } else if (strokeRgb && strokeWidth) {
    page.pushOperators(
      setLineWidth(strokeWidth),
      setStrokingColor(strokeRgb),
      ...pathOps,
      stroke(),
    )
  }

  page.pushOperators(popGraphicsState())
}
