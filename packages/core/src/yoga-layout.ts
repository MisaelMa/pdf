import {
  loadYoga,
  type Yoga,
  type Node as YogaNode,
  Align,
  FlexDirection,
  Justify,
  Edge,
  Gutter,
  PositionType,
  Wrap,
} from 'yoga-layout/load'
import type { PDFFont } from 'pdf-lib'
import type { PDFNode, PDFChild, PDFStyle, LayoutNode, ResolvedStyle } from './types'
import { resolveStyle } from './stylesheet'
import { resolveFontName, getFontFromMap } from './font'

let yoga: Yoga | null = null

export async function initYoga(): Promise<Yoga> {
  if (!yoga) {
    yoga = await loadYoga()
  }
  return yoga
}

interface TextMeasureContext {
  fontMap: Map<string, PDFFont>
  text: string
  style: ResolvedStyle
}

export function buildYogaTree(
  yg: Yoga,
  fontMap: Map<string, PDFFont>,
  node: PDFNode,
  parentWidth: number,
  parentHeight: number,
): LayoutNode[] {
  const rootYogaNode = createYogaNode(yg, fontMap, node)
  rootYogaNode.calculateLayout(parentWidth, parentHeight)

  const layouts = collectLayouts(rootYogaNode, node, 0, 0)
  rootYogaNode.freeRecursive()
  return layouts
}

function createYogaNode(
  yg: Yoga,
  fontMap: Map<string, PDFFont>,
  pdfNode: PDFNode,
): YogaNode {
  const ygNode = yg.Node.create()
  const style = resolveStyle(pdfNode.props.style)

  applyStyle(ygNode, style, pdfNode)

  if (pdfNode.type === 'TEXT') {
    const text = extractText(pdfNode.children)
    const measureCtx: TextMeasureContext = { fontMap, text, style }

    ygNode.setMeasureFunc((width, widthMode) => {
      const { fontMap: fm, text: t, style: s } = measureCtx
      if (!t) return { width: 0, height: 0 }

      const fontName = resolveFontName(s)
      const font = getFontFromMap(fm, fontName)
      const maxW = widthMode === 0 ? Infinity : width
      const lineGap = s.lineHeight ? (s.lineHeight - 1) * s.fontSize : 0

      const { width: mw, height: mh } = measureMultilineText(font, t, s.fontSize, maxW, lineGap)
      return { width: mw, height: mh }
    })
    return ygNode
  }

  if (pdfNode.type === 'IMAGE') {
    return ygNode
  }

  if (pdfNode.type === 'INPUT' || pdfNode.type === 'CHECKBOX' || pdfNode.type === 'SELECT') {
    if (style.height == null) {
      ygNode.setHeight(pdfNode.type === 'CHECKBOX' ? 14 : 24)
    }
    if (style.width == null && pdfNode.type === 'CHECKBOX') {
      ygNode.setWidth(14)
    }
    return ygNode
  }

  const childNodes = pdfNode.children.filter(
    (c): c is PDFNode => typeof c !== 'string',
  )

  for (let i = 0; i < childNodes.length; i++) {
    const childYg = createYogaNode(yg, fontMap, childNodes[i])
    ygNode.insertChild(childYg, i)
  }

  return ygNode
}

/**
 * Measure multiline text by word-wrapping to fit within maxWidth.
 */
export function measureMultilineText(
  font: PDFFont,
  text: string,
  fontSize: number,
  maxWidth: number,
  lineGap: number = 0,
): { width: number; height: number } {
  const baseLineHeight = font.heightAtSize(fontSize)
  const effectiveLineHeight = baseLineHeight + lineGap

  if (!text) return { width: 0, height: effectiveLineHeight }

  const lines = wrapText(font, text, fontSize, maxWidth)
  const measuredWidth = Math.min(
    Math.max(...lines.map((line) => font.widthOfTextAtSize(line, fontSize))),
    maxWidth === Infinity ? Infinity : maxWidth,
  )
  const measuredHeight = lines.length * effectiveLineHeight

  return { width: measuredWidth, height: measuredHeight }
}

/**
 * Split text into lines that fit within maxWidth.
 */
export function wrapText(
  font: PDFFont,
  text: string,
  fontSize: number,
  maxWidth: number,
): string[] {
  if (!text) return ['']
  if (maxWidth === Infinity || maxWidth <= 0) return [text]

  const words = text.split(/\s+/)
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    if (!word) continue
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const testWidth = font.widthOfTextAtSize(testLine, fontSize)

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }

  if (currentLine) lines.push(currentLine)
  if (lines.length === 0) lines.push('')

  return lines
}

function applyStyle(ygNode: YogaNode, style: ResolvedStyle, pdfNode: PDFNode): void {
  if (style.width != null) ygNode.setWidth(style.width)
  if (style.height != null) ygNode.setHeight(style.height)

  if (style.marginTop) ygNode.setMargin(Edge.Top, style.marginTop)
  if (style.marginRight) ygNode.setMargin(Edge.Right, style.marginRight)
  if (style.marginBottom) ygNode.setMargin(Edge.Bottom, style.marginBottom)
  if (style.marginLeft) ygNode.setMargin(Edge.Left, style.marginLeft)

  if (style.paddingTop) ygNode.setPadding(Edge.Top, style.paddingTop)
  if (style.paddingRight) ygNode.setPadding(Edge.Right, style.paddingRight)
  if (style.paddingBottom) ygNode.setPadding(Edge.Bottom, style.paddingBottom)
  if (style.paddingLeft) ygNode.setPadding(Edge.Left, style.paddingLeft)

  if (style.borderWidth) ygNode.setBorder(Edge.All, style.borderWidth)

  const fd = style.flexDirection
  if (fd === 'row') ygNode.setFlexDirection(FlexDirection.Row)
  else ygNode.setFlexDirection(FlexDirection.Column)

  const jc = (pdfNode.props.style as PDFStyle)?.justifyContent
  if (jc) {
    const map: Record<string, Justify> = {
      'flex-start': Justify.FlexStart,
      'flex-end': Justify.FlexEnd,
      'center': Justify.Center,
      'space-between': Justify.SpaceBetween,
      'space-around': Justify.SpaceAround,
    }
    if (map[jc]) ygNode.setJustifyContent(map[jc])
  }

  const ai = (pdfNode.props.style as PDFStyle)?.alignItems
  if (ai) {
    const map: Record<string, Align> = {
      'flex-start': Align.FlexStart,
      'flex-end': Align.FlexEnd,
      'center': Align.Center,
      'stretch': Align.Stretch,
    }
    if (map[ai]) ygNode.setAlignItems(map[ai])
  }

  const as_ = (pdfNode.props.style as PDFStyle)?.alignSelf
  if (as_ && as_ !== 'auto') {
    const map: Record<string, Align> = {
      'flex-start': Align.FlexStart,
      'flex-end': Align.FlexEnd,
      'center': Align.Center,
      'stretch': Align.Stretch,
    }
    if (map[as_]) ygNode.setAlignSelf(map[as_])
  }

  const rawStyle = pdfNode.props.style as PDFStyle | undefined
  if (rawStyle?.flex != null) ygNode.setFlex(rawStyle.flex)
  if (rawStyle?.flexGrow != null) ygNode.setFlexGrow(rawStyle.flexGrow)
  if (rawStyle?.flexShrink != null) ygNode.setFlexShrink(rawStyle.flexShrink)
  if (rawStyle?.flexBasis != null) {
    const fb = rawStyle.flexBasis
    if (typeof fb === 'number') ygNode.setFlexBasis(fb)
    else if (typeof fb === 'string') ygNode.setFlexBasis(fb as any)
  }

  if (rawStyle?.flexWrap === 'wrap') ygNode.setFlexWrap(Wrap.Wrap)

  if (style.gap > 0) ygNode.setGap(Gutter.All, style.gap)
  if (rawStyle?.rowGap != null) ygNode.setGap(Gutter.Row, rawStyle.rowGap)
  if (rawStyle?.columnGap != null) ygNode.setGap(Gutter.Column, rawStyle.columnGap)

  if (style.position === 'absolute') ygNode.setPositionType(PositionType.Absolute)
  if (style.top != null) ygNode.setPosition(Edge.Top, style.top)
  if (style.left != null) ygNode.setPosition(Edge.Left, style.left)
  if (style.right != null) ygNode.setPosition(Edge.Right, style.right)
  if (style.bottom != null) ygNode.setPosition(Edge.Bottom, style.bottom)

  if (rawStyle?.minHeight != null) ygNode.setMinHeight(rawStyle.minHeight as number)
  if (rawStyle?.maxHeight != null) ygNode.setMaxHeight(rawStyle.maxHeight as number)
}

function collectLayouts(
  ygNode: YogaNode,
  pdfNode: PDFNode,
  offsetX: number,
  offsetY: number,
): LayoutNode[] {
  const layout = ygNode.getComputedLayout()
  const x = offsetX + layout.left
  const y = offsetY + layout.top
  const width = layout.width
  const height = layout.height

  const style = resolveStyle(pdfNode.props.style)

  let textContent: string | undefined
  if (pdfNode.type === 'TEXT' || (pdfNode.type === 'LINK' && hasTextChildren(pdfNode))) {
    textContent = extractText(pdfNode.children)
    const tt = style.textTransform
    if (tt === 'uppercase') textContent = textContent.toUpperCase()
    else if (tt === 'lowercase') textContent = textContent.toLowerCase()
    else if (tt === 'capitalize') textContent = textContent.replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const childLayouts: LayoutNode[] = []
  let childIdx = 0
  for (let i = 0; i < ygNode.getChildCount(); i++) {
    const childYg = ygNode.getChild(i)
    while (childIdx < pdfNode.children.length && typeof pdfNode.children[childIdx] === 'string') {
      childIdx++
    }
    if (childIdx < pdfNode.children.length) {
      const childPdf = pdfNode.children[childIdx] as PDFNode
      childLayouts.push(...collectLayouts(childYg, childPdf, x, y))
      childIdx++
    }
  }

  return [{ node: pdfNode, x, y, width, height, style, children: childLayouts, textContent }]
}

function hasTextChildren(node: PDFNode): boolean {
  return node.children.some(
    (c) => typeof c === 'string' || (typeof c !== 'string' && c.type === 'TEXT'),
  )
}

function extractText(children: PDFChild[]): string {
  return children
    .map((child) => {
      if (typeof child === 'string') return child
      if (child.type === 'TEXT' || child.type === 'LINK') return extractText(child.children)
      return ''
    })
    .join('')
}
