import type { ReactNode } from 'react'
import type { PDFStyle, PageSize, PageOrientation } from '@pdfcraft/core'

// Each component is a thin marker — it renders its children as a React
// fragment so the tree can be inspected by PDFViewer without hitting the DOM.
// The `__pdfType` static property lets the tree-builder identify them.

export interface DocumentProps {
  title?: string
  author?: string
  subject?: string
  keywords?: string
  creator?: string
  producer?: string
  pdfVersion?: string
  language?: string
  children?: ReactNode
}

export function Document({ children }: DocumentProps) {
  return <>{children}</>
}
;(Document as any).__pdfType = 'DOCUMENT'

export interface PageProps {
  size?: PageSize
  orientation?: PageOrientation
  style?: PDFStyle | PDFStyle[]
  wrap?: boolean
  dpi?: number
  children?: ReactNode
}

export function Page({ children }: PageProps) {
  return <>{children}</>
}
;(Page as any).__pdfType = 'PAGE'

export interface ViewProps {
  style?: PDFStyle | PDFStyle[]
  wrap?: boolean
  fixed?: boolean
  children?: ReactNode
}

export function View({ children }: ViewProps) {
  return <>{children}</>
}
;(View as any).__pdfType = 'VIEW'

export interface TextComponentProps {
  style?: PDFStyle | PDFStyle[]
  wrap?: boolean
  fixed?: boolean
  children?: ReactNode
}

export function Text({ children }: TextComponentProps) {
  return <>{children}</>
}
;(Text as any).__pdfType = 'TEXT'

export interface ImageComponentProps {
  src: string | ArrayBuffer | Uint8Array
  style?: PDFStyle | PDFStyle[]
  fixed?: boolean
  cache?: boolean
}

export function Image(_props: ImageComponentProps) {
  return null
}
;(Image as any).__pdfType = 'IMAGE'

export interface LinkComponentProps {
  src: string
  style?: PDFStyle | PDFStyle[]
  wrap?: boolean
  fixed?: boolean
  children?: ReactNode
}

export function Link({ children }: LinkComponentProps) {
  return <>{children}</>
}
;(Link as any).__pdfType = 'LINK'

export interface TableComponentProps {
  style?: PDFStyle | PDFStyle[]
  wrap?: boolean
  children?: ReactNode
}

export function Table({ children }: TableComponentProps) {
  return <>{children}</>
}
;(Table as any).__pdfType = 'VIEW'
;(Table as any).__pdfTableHint = 'TABLE'

export interface TableRowComponentProps {
  style?: PDFStyle | PDFStyle[]
  children?: ReactNode
}

export function TableRow({ children }: TableRowComponentProps) {
  return <>{children}</>
}
;(TableRow as any).__pdfType = 'VIEW'
;(TableRow as any).__pdfTableHint = 'TABLE_ROW'

export interface TableCellComponentProps {
  style?: PDFStyle | PDFStyle[]
  colSpan?: number
  children?: ReactNode
}

export function TableCell({ children }: TableCellComponentProps) {
  return <>{children}</>
}
;(TableCell as any).__pdfType = 'VIEW'
;(TableCell as any).__pdfTableHint = 'TABLE_CELL'
