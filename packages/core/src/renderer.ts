import PDFDocument from 'pdfkit'
import type { PDFNode, PDFChild, LayoutNode, ResolvedStyle } from './types'
import { resolvePageSize } from './page-sizes'
import { resolveStyle } from './stylesheet'
import { resolveFontName, registerFontsOnDocument } from './font'

export async function renderToBuffer(documentNode: PDFNode): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const doc = createPDFDocument(documentNode)
    const chunks: any[] = []

    doc.on('data', (chunk: any) => chunks.push(chunk))
    doc.on('end', () => {
      const buffer = Buffer.concat(chunks)
      resolve(new Uint8Array(buffer))
    })
    doc.on('error', reject)

    try {
      renderDocument(doc, documentNode)
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
  renderDocument(doc, documentNode)
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

function renderDocument(doc: PDFKit.PDFDocument, documentNode: PDFNode): void {
  for (const child of documentNode.children) {
    if (typeof child === 'string') continue
    if (child.type === 'PAGE') {
      renderPage(doc, child)
    }
  }
}

function renderPage(doc: PDFKit.PDFDocument, pageNode: PDFNode): void {
  const size = resolvePageSize(pageNode.props.size, pageNode.props.orientation)
  doc.addPage({ size: [size.width, size.height], margin: 0 })

  const style = resolveStyle(pageNode.props.style)

  if (style.backgroundColor) {
    doc.save()
    doc.rect(0, 0, size.width, size.height).fill(style.backgroundColor)
    doc.restore()
  }

  const contentX = style.paddingLeft
  const contentY = style.paddingTop
  const contentWidth = size.width - style.paddingLeft - style.paddingRight

  const layouts = layoutChildren(
    doc,
    pageNode.children,
    contentX,
    contentY,
    contentWidth,
    style,
  )

  for (const layout of layouts) {
    renderLayoutNode(doc, layout)
  }
}

// ── Layout pass ──────────────────────────────────────────────────────

function layoutChildren(
  doc: PDFKit.PDFDocument,
  children: PDFChild[],
  x: number,
  startY: number,
  availableWidth: number,
  parentStyle: ResolvedStyle,
): LayoutNode[] {
  const layouts: LayoutNode[] = []
  let cursorY = startY

  const nodes = children.filter((c): c is PDFNode => typeof c !== 'string')

  for (let i = 0; i < nodes.length; i++) {
    if (i > 0 && parentStyle.gap > 0) {
      cursorY += parentStyle.gap
    }

    const layout = layoutNode(doc, nodes[i], x, cursorY, availableWidth)
    layouts.push(layout)
    cursorY = layout.y + layout.height + layout.style.marginBottom
  }

  return layouts
}

function layoutNode(
  doc: PDFKit.PDFDocument,
  node: PDFNode,
  x: number,
  y: number,
  availableWidth: number,
): LayoutNode {
  const style = resolveStyle(node.props.style)

  const boxX = x + style.marginLeft
  const boxY = y + style.marginTop
  const boxWidth =
    style.width ?? availableWidth - style.marginLeft - style.marginRight
  const contentWidth = boxWidth - style.paddingLeft - style.paddingRight

  let contentHeight = 0
  let childLayouts: LayoutNode[] = []
  let textContent: string | undefined

  switch (node.type) {
    case 'TEXT': {
      textContent = extractText(node.children)
      textContent = applyTextTransform(textContent, style.textTransform)

      doc.save()
      doc.fontSize(style.fontSize)
      doc.font(resolveFontName(style))

      const textOpts: any = {
        width: Math.max(contentWidth, 0),
        align: style.textAlign,
      }
      if (style.lineHeight) {
        textOpts.lineGap = (style.lineHeight - 1) * style.fontSize
      }

      contentHeight = doc.heightOfString(textContent || ' ', textOpts)
      doc.restore()
      break
    }

    case 'IMAGE': {
      const imgW =
        style.width != null
          ? style.width - style.paddingLeft - style.paddingRight
          : contentWidth
      const imgH =
        style.height != null
          ? style.height - style.paddingTop - style.paddingBottom
          : imgW * 0.75
      contentHeight = imgH
      break
    }

    case 'VIEW':
    case 'LINK':
    default: {
      const contentX = boxX + style.paddingLeft
      const contentY = boxY + style.paddingTop
      childLayouts = layoutChildren(
        doc,
        node.children,
        contentX,
        contentY,
        contentWidth,
        style,
      )

      if (childLayouts.length > 0) {
        const last = childLayouts[childLayouts.length - 1]
        contentHeight = last.y + last.height + last.style.marginBottom - contentY
      }
      break
    }
  }

  const boxHeight =
    style.height ?? style.paddingTop + contentHeight + style.paddingBottom

  return {
    node,
    x: boxX,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    style,
    children: childLayouts,
    textContent,
  }
}

// ── Render pass ──────────────────────────────────────────────────────

function renderLayoutNode(
  doc: PDFKit.PDFDocument,
  layout: LayoutNode,
): void {
  const { x, y, width, height, style, node, children, textContent } = layout

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
    doc.save()
    if (style.opacity < 1) doc.opacity(style.opacity)

    doc.fontSize(style.fontSize)
    doc.fillColor(style.color)
    doc.font(resolveFontName(style))

    const cX = x + style.paddingLeft
    const cY = y + style.paddingTop
    const cW = width - style.paddingLeft - style.paddingRight

    const opts: any = { width: Math.max(cW, 0), align: style.textAlign }
    if (style.lineHeight) {
      opts.lineGap = (style.lineHeight - 1) * style.fontSize
    }
    if (style.letterSpacing) {
      opts.characterSpacing = style.letterSpacing
    }
    if (style.textDecoration === 'underline') opts.underline = true
    if (style.textDecoration === 'line-through') opts.strike = true

    doc.text(textContent, cX, cY, opts)
    doc.restore()
  }

  if (node.type === 'IMAGE' && node.props.src) {
    doc.save()
    const cX = x + style.paddingLeft
    const cY = y + style.paddingTop
    const cW = width - style.paddingLeft - style.paddingRight
    const cH = height - style.paddingTop - style.paddingBottom

    try {
      doc.image(node.props.src, cX, cY, {
        width: cW,
        height: cH,
        fit: style.objectFit === 'cover' ? undefined : [cW, cH],
        cover:
          style.objectFit === 'cover' ? [cW, cH] : undefined,
      })
    } catch {
      // skip unloadable images
    }
    doc.restore()
  }

  if (node.type === 'LINK' && node.props.src) {
    doc.link(x, y, width, height, node.props.src)
  }

  for (const child of children) {
    renderLayoutNode(doc, child)
  }
}

// ── Helpers ──────────────────────────────────────────────────────────

function extractText(children: PDFChild[]): string {
  return children
    .map((child) => {
      if (typeof child === 'string') return child
      if (child.type === 'TEXT' || child.type === 'LINK') {
        return extractText(child.children)
      }
      return ''
    })
    .join('')
}

function applyTextTransform(
  text: string,
  transform?: string,
): string {
  switch (transform) {
    case 'uppercase':
      return text.toUpperCase()
    case 'lowercase':
      return text.toLowerCase()
    case 'capitalize':
      return text.replace(/\b\w/g, (c) => c.toUpperCase())
    default:
      return text
  }
}
