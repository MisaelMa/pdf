import { Children, isValidElement, type ReactNode } from 'react'
import {
  Document as CoreDocument,
  Page as CorePage,
  View as CoreView,
  Text as CoreText,
  Image as CoreImage,
  Link as CoreLink,
  Table as CoreTable,
  TableRow as CoreTableRow,
  TableCell as CoreTableCell,
  type PDFNode,
  type PDFChild,
} from '@pdf.js/core'

/**
 * Walks a React element tree and converts elements whose `.type` carries a
 * `__pdfType` marker into the equivalent core PDFNode tree.
 */
export function buildPDFTree(children: ReactNode): PDFNode | null {
  const elements = Children.toArray(children)
  for (const el of elements) {
    if (!isValidElement(el)) continue
    const node = processElement(el)
    if (node && typeof node !== 'string' && node.type === 'DOCUMENT') {
      return node
    }
  }
  return null
}

function processElement(element: any): PDFChild | null {
  if (typeof element === 'string') return element
  if (typeof element === 'number') return String(element)
  if (!isValidElement(element)) return null

  const type = (element as any).type as any

  if (type?.__pdfType) {
    const { children: childProp, ...restProps } = (element as any).props ?? {}
    const childNodes = processChildren(childProp)

    switch (type.__pdfType) {
      case 'DOCUMENT':
        return CoreDocument(restProps, childNodes)
      case 'PAGE':
        return CorePage(restProps, childNodes)
      case 'VIEW':
        if (type.__pdfTableHint === 'TABLE') return CoreTable(restProps, childNodes)
        if (type.__pdfTableHint === 'TABLE_ROW') return CoreTableRow(restProps, childNodes)
        if (type.__pdfTableHint === 'TABLE_CELL') return CoreTableCell(restProps, childNodes)
        return CoreView(restProps, childNodes)
      case 'TEXT':
        return CoreText(restProps, childNodes)
      case 'IMAGE':
        return CoreImage(restProps)
      case 'LINK':
        return CoreLink(restProps, childNodes)
    }
  }

  // Try to recurse into unknown wrappers (fragments, divs, etc.)
  const { children: childProp } = (element as any).props ?? {}
  if (childProp != null) {
    const nodes = processChildren(childProp)
    for (const n of nodes) {
      if (typeof n !== 'string' && n.type === 'DOCUMENT') return n
    }
  }

  return null
}

function processChildren(children: ReactNode): PDFChild[] {
  if (children == null) return []
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string') return child
      if (typeof child === 'number') return String(child)
      if (isValidElement(child)) return processElement(child)
      return null
    })
    .filter((c): c is PDFChild => c !== null)
}
