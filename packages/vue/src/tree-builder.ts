import { Text as VueTextSymbol, Fragment, Comment, type VNode } from 'vue'
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Link,
  Table,
  TableRow,
  TableCell,
  type PDFNode,
  type PDFChild,
} from '@pdf.js/core'

/**
 * Walks a Vue VNode tree produced by `slots.default()` and converts
 * any PDF component VNodes (those whose `.type` has a `__pdfType` marker)
 * into the equivalent core PDFNode tree.
 */
export function buildPDFTree(vnodes: VNode[]): PDFNode | null {
  for (const vnode of vnodes) {
    const node = processVNode(vnode)
    if (node && typeof node !== 'string' && node.type === 'DOCUMENT') {
      return node
    }
  }

  // Unwrap fragments: the root might be wrapped in a Fragment
  for (const vnode of vnodes) {
    if (vnode.type === Fragment && Array.isArray(vnode.children)) {
      const inner = buildPDFTree(vnode.children as VNode[])
      if (inner) return inner
    }
  }

  return null
}

function processVNode(vnode: VNode): PDFChild | null {
  if (!vnode) return null

  if (vnode.type === VueTextSymbol) {
    const text = String(vnode.children ?? '')
    return text ? text : null
  }

  if (vnode.type === Comment) return null

  if (vnode.type === Fragment && Array.isArray(vnode.children)) {
    const nodes = (vnode.children as VNode[])
      .map(processVNode)
      .filter((c): c is PDFChild => c !== null)
    return nodes.length === 1 ? nodes[0] : null
  }

  const type = vnode.type as any
  if (type?.__pdfType) {
    const slotChildren = getSlotVNodes(vnode)
    const childNodes = slotChildren
      .map(processVNode)
      .filter((c): c is PDFChild => c !== null)

    const props: Record<string, any> = { ...(vnode.props || {}) }

    switch (type.__pdfType) {
      case 'DOCUMENT':
        return Document(props as any, childNodes)
      case 'PAGE':
        return Page(props as any, childNodes)
      case 'VIEW':
        if (type.__pdfTableHint === 'TABLE') return Table(props as any, childNodes)
        if (type.__pdfTableHint === 'TABLE_ROW') return TableRow(props as any, childNodes)
        if (type.__pdfTableHint === 'TABLE_CELL') return TableCell(props as any, childNodes)
        return View(props as any, childNodes)
      case 'TEXT':
        return Text(props as any, childNodes)
      case 'IMAGE':
        return Image(props as any)
      case 'LINK':
        return Link(props as any, childNodes)
    }
  }

  if (typeof vnode.children === 'string') {
    return vnode.children
  }

  return null
}

function getSlotVNodes(vnode: VNode): VNode[] {
  const children = vnode.children as any
  if (children && typeof children === 'object' && !Array.isArray(children)) {
    if (typeof children.default === 'function') {
      const result = children.default()
      return Array.isArray(result) ? result : [result]
    }
  }
  if (Array.isArray(children)) {
    return children as VNode[]
  }
  return []
}
