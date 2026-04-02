import PDFDocument from 'pdfkit'
import type { PDFNode, PDFChild, LayoutNode, ResolvedStyle } from './types'
import { resolvePageSize } from './page-sizes'
import { resolveStyle } from './stylesheet'
import { resolveFontName, registerFontsOnDocument } from './font'
import { fetchImage } from './image-loader'
import { initYoga, buildYogaTree } from './yoga-layout'

export async function renderToBuffer(documentNode: PDFNode): Promise<Uint8Array> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = createPDFDocument(documentNode)
      const chunks: any[] = []

      doc.on('data', (chunk: any) => chunks.push(chunk))
      doc.on('end', () => {
        const buffer = Buffer.concat(chunks)
        resolve(new Uint8Array(buffer))
      })
      doc.on('error', reject)

      await renderDocument(doc, documentNode)
      doc.end()
    } catch (err) {
      reject(err)
    }
  })
}

export async function renderToBlob(documentNode: PDFNode): Promise<Blob> {
  const buffer = await renderToBuffer(documentNode)
  return new Blob([buffer.buffer as ArrayBuffer], { type: 'application/pdf' })
}

export async function renderToStream(documentNode: PDFNode): Promise<any> {
  const doc = createPDFDocument(documentNode)
  await renderDocument(doc, documentNode)
  doc.end()
  return doc
}

export async function renderToFile(
  documentNode: PDFNode,
  filePath: string,
): Promise<void> {
  const buffer = await renderToBuffer(documentNode)
  const mod = 'fs/promises'
  const { writeFile } = await (Function('m', 'return import(m)')(mod))
  await writeFile(filePath, buffer)
}

function createPDFDocument(documentNode: PDFNode): PDFKit.PDFDocument {
  const props = documentNode.props

  const info: Record<string, string> = {
    Creator: props.creator || 'pdfcraft',
    Producer: props.producer || 'pdfcraft',
  }
  if (props.title) info.Title = props.title
  if (props.author) info.Author = props.author
  if (props.subject) info.Subject = props.subject
  if (props.keywords) info.Keywords = props.keywords

  const options: Record<string, any> = {
    autoFirstPage: false,
    bufferPages: true,
    info,
  }
  if (props.language) options.lang = props.language

  const doc = new PDFDocument(options)
  registerFontsOnDocument(doc)
  return doc
}

async function renderDocument(doc: PDFKit.PDFDocument, documentNode: PDFNode): Promise<void> {
  const yg = await initYoga()

  for (const child of documentNode.children) {
    if (typeof child === 'string') continue
    if (child.type === 'PAGE') {
      await renderPage(doc, child, yg)
    }
  }
}

// ── Image preloading ────────────────────────────────────────────────

const loadedImages = new Map<string, Buffer>()

async function preloadImages(node: PDFNode): Promise<void> {
  const promises: Promise<void>[] = []

  function walk(n: PDFChild) {
    if (typeof n === 'string') return
    if (n.type === 'IMAGE' && n.props.src) {
      const src = n.props.src
      if (typeof src === 'string' && !loadedImages.has(src)) {
        promises.push(
          fetchImage(src)
            .then((buf) => { loadedImages.set(src, Buffer.from(buf)) })
            .catch(() => {}),
        )
      }
    }
    for (const child of n.children) walk(child)
  }

  walk(node)
  await Promise.all(promises)
}

// ── Page rendering with Yoga layout + wrap ─────────────────────────

async function renderPage(
  doc: PDFKit.PDFDocument,
  pageNode: PDFNode,
  yg: any,
): Promise<void> {
  const size = resolvePageSize(pageNode.props.size, pageNode.props.orientation)
  const pageStyle = resolveStyle(pageNode.props.style)
  const wrapEnabled = pageNode.props.wrap !== false

  await preloadImages(pageNode)

  const layouts = buildYogaTree(yg, doc, pageNode, size.width, size.height)

  if (!wrapEnabled) {
    addNewPage(doc, size, pageStyle)
    for (const layout of layouts) renderLayoutNode(doc, layout)
    return
  }

  const pageContentHeight = size.height
  const flatNodes = flattenForWrapping(layouts)

  if (flatNodes.length === 0) {
    addNewPage(doc, size, pageStyle)
    return
  }

  const totalContentHeight = flatNodes.reduce(
    (max, n) => Math.max(max, n.y + n.height),
    0,
  )

  if (totalContentHeight <= pageContentHeight) {
    addNewPage(doc, size, pageStyle)
    for (const layout of layouts) renderLayoutNode(doc, layout)
    return
  }

  let pageStartY = 0
  let pageIndex = 0

  while (pageStartY < totalContentHeight) {
    const pageEndY = pageStartY + pageContentHeight
    addNewPage(doc, size, pageStyle)

    for (const node of flatNodes) {
      if (node.node.type === 'PAGE') continue
      const nodeBottom = node.y + node.height
      const nodeTop = node.y

      if (nodeBottom <= pageStartY || nodeTop >= pageEndY) continue

      const offsetNode = {
        ...node,
        y: node.y - pageStartY,
        children: [],
      }
      renderLayoutNode(doc, offsetNode)
    }

    pageStartY = pageEndY
    pageIndex++
    if (pageIndex > 100) break
  }
}

function addNewPage(
  doc: PDFKit.PDFDocument,
  size: { width: number; height: number },
  pageStyle: ResolvedStyle,
): void {
  doc.addPage({ size: [size.width, size.height], margin: 0 })

  if (pageStyle.backgroundColor) {
    doc.save()
    doc.rect(0, 0, size.width, size.height).fill(pageStyle.backgroundColor)
    doc.restore()
  }
}

/**
 * Flatten the layout tree into leaf/renderable nodes for page splitting.
 * We keep nodes that have visual output (text, image, background, border)
 * and skip pure container nodes whose children handle rendering.
 */
function flattenForWrapping(layouts: LayoutNode[]): LayoutNode[] {
  const result: LayoutNode[] = []

  function walk(layout: LayoutNode) {
    const hasVisual =
      layout.textContent ||
      layout.node.type === 'IMAGE' ||
      layout.style.backgroundColor ||
      layout.style.borderWidth > 0

    if (hasVisual) {
      result.push(layout)
    }

    if (layout.node.type === 'LINK' && layout.node.props.src) {
      if (!hasVisual) result.push(layout)
    }

    for (const child of layout.children) walk(child)
  }

  for (const layout of layouts) walk(layout)
  return result
}

// ── Render pass ──────────────────────────────────────────────────────

function renderLayoutNode(
  doc: PDFKit.PDFDocument,
  layout: LayoutNode,
): void {
  const { x, y, width, height, style, node, children, textContent } = layout

  if (node.type === 'PAGE') {
    for (const child of children) renderLayoutNode(doc, child)
    return
  }

  if (style.backgroundColor) {
    doc.save()
    if (style.borderRadius > 0) {
      doc.roundedRect(x, y, width, height, style.borderRadius)
        .fill(style.backgroundColor)
    } else {
      doc.rect(x, y, width, height).fill(style.backgroundColor)
    }
    doc.restore()
  }

  if (style.borderWidth > 0) {
    doc.save()
    doc.lineWidth(style.borderWidth).strokeColor(style.borderColor)
    if (style.borderStyle === 'dashed') doc.dash(5, { space: 3 })
    if (style.borderStyle === 'dotted') doc.dash(1, { space: 2 })

    if (style.borderRadius > 0) {
      doc.roundedRect(x, y, width, height, style.borderRadius).stroke()
    } else {
      doc.rect(x, y, width, height).stroke()
    }
    doc.restore()
  }

  if (node.type === 'TEXT' && textContent) {
    renderText(doc, layout)
  }

  if (node.type === 'LINK') {
    if (textContent) renderText(doc, layout)
    if (node.props.src) doc.link(x, y, width, height, node.props.src)
  }

  if (node.type === 'IMAGE' && node.props.src) {
    renderImage(doc, layout)
  }

  for (const child of children) renderLayoutNode(doc, child)
}

function renderText(doc: PDFKit.PDFDocument, layout: LayoutNode): void {
  const { x, y, width, style, textContent } = layout
  if (!textContent) return

  doc.save()
  if (style.opacity < 1) doc.opacity(style.opacity)

  doc.fontSize(style.fontSize)
  doc.fillColor(style.color)
  doc.font(resolveFontName(style))

  const cX = x + style.paddingLeft
  const cY = y + style.paddingTop
  const cW = width - style.paddingLeft - style.paddingRight

  const opts: any = { width: Math.max(cW, 0), align: style.textAlign }
  if (style.lineHeight) opts.lineGap = (style.lineHeight - 1) * style.fontSize
  if (style.letterSpacing) opts.characterSpacing = style.letterSpacing
  if (style.textDecoration === 'underline') opts.underline = true
  if (style.textDecoration === 'line-through') opts.strike = true

  if (layout.node.type === 'LINK') {
    opts.link = layout.node.props.src
    opts.underline = opts.underline ?? true
    if (style.color === '#000000') doc.fillColor('#0000EE')
  }

  doc.text(textContent, cX, cY, opts)
  doc.restore()
}

function renderImage(doc: PDFKit.PDFDocument, layout: LayoutNode): void {
  const { x, y, width, height, style, node } = layout
  const cX = x + style.paddingLeft
  const cY = y + style.paddingTop
  const cW = width - style.paddingLeft - style.paddingRight
  const cH = height - style.paddingTop - style.paddingBottom

  doc.save()
  try {
    let imgSrc: any = node.props.src
    if (typeof imgSrc === 'string' && loadedImages.has(imgSrc)) {
      imgSrc = loadedImages.get(imgSrc)
    }

    const imgOpts: any = { width: cW, height: cH }
    if (style.objectFit === 'contain') {
      imgOpts.fit = [cW, cH]
      imgOpts.align = 'center'
      imgOpts.valign = 'center'
      delete imgOpts.width
      delete imgOpts.height
    } else if (style.objectFit === 'cover') {
      imgOpts.cover = [cW, cH]
      delete imgOpts.width
      delete imgOpts.height
    }

    doc.image(imgSrc, cX, cY, imgOpts)
  } catch {
    // skip unrenderable images
  }
  doc.restore()
}
