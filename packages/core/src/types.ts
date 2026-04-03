export interface PDFStyle {
  width?: number | string
  height?: number | string
  minHeight?: number
  maxHeight?: number

  margin?: number
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
  marginHorizontal?: number
  marginVertical?: number

  padding?: number
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingHorizontal?: number
  paddingVertical?: number

  flexDirection?: 'row' | 'column'
  flexWrap?: 'nowrap' | 'wrap'
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch'
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch'
  flex?: number
  flexGrow?: number
  flexShrink?: number
  flexBasis?: number | string
  gap?: number
  rowGap?: number
  columnGap?: number

  fontSize?: number
  fontFamily?: string
  fontWeight?: number | 'normal' | 'bold' | 'light'
  fontStyle?: 'normal' | 'italic'
  color?: string
  textAlign?: 'left' | 'right' | 'center' | 'justify'
  lineHeight?: number
  letterSpacing?: number
  textDecoration?: 'none' | 'underline' | 'line-through'
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'

  backgroundColor?: string
  borderWidth?: number
  borderColor?: string
  borderRadius?: number
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  opacity?: number

  position?: 'relative' | 'absolute'
  top?: number
  left?: number
  right?: number
  bottom?: number

  objectFit?: 'contain' | 'cover' | 'fill' | 'none'
}

export type PageSize =
  | 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6'
  | 'B0' | 'B1' | 'B2' | 'B3' | 'B4' | 'B5'
  | 'LETTER' | 'LEGAL' | 'TABLOID' | 'EXECUTIVE' | 'FOLIO'
  | [number, number]
  | { width: number; height: number }

export type PageOrientation = 'portrait' | 'landscape'

export interface DocumentProps {
  title?: string
  author?: string
  subject?: string
  keywords?: string
  creator?: string
  producer?: string
  pdfVersion?: string
  language?: string
}

export interface PageProps {
  size?: PageSize
  orientation?: PageOrientation
  style?: PDFStyle | PDFStyle[]
  wrap?: boolean
  dpi?: number
}

export interface ViewProps {
  style?: PDFStyle | PDFStyle[]
  wrap?: boolean
  fixed?: boolean
}

export interface TextProps {
  style?: PDFStyle | PDFStyle[]
  wrap?: boolean
  fixed?: boolean
}

export interface ImageProps {
  src: string | ArrayBuffer | Uint8Array
  style?: PDFStyle | PDFStyle[]
  fixed?: boolean
  cache?: boolean
}

export interface LinkProps {
  src: string
  style?: PDFStyle | PDFStyle[]
  wrap?: boolean
  fixed?: boolean
}

export interface TableProps {
  style?: PDFStyle | PDFStyle[]
  wrap?: boolean
}

export interface TableRowProps {
  style?: PDFStyle | PDFStyle[]
}

export interface TableCellProps {
  style?: PDFStyle | PDFStyle[]
  colSpan?: number
}

export type PDFNodeType = 'DOCUMENT' | 'PAGE' | 'VIEW' | 'TEXT' | 'IMAGE' | 'LINK'

export interface PDFNode {
  type: PDFNodeType
  props: Record<string, any>
  children: PDFChild[]
}

export type PDFChild = PDFNode | string

export interface ResolvedStyle {
  marginTop: number
  marginRight: number
  marginBottom: number
  marginLeft: number
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  paddingLeft: number
  width?: number
  height?: number
  fontSize: number
  fontFamily: string
  fontWeight?: string | number
  fontStyle?: string
  color: string
  backgroundColor?: string
  textAlign: 'left' | 'right' | 'center' | 'justify'
  lineHeight?: number
  letterSpacing?: number
  textDecoration?: string
  textTransform?: string
  borderWidth: number
  borderColor: string
  borderRadius: number
  borderStyle: string
  opacity: number
  flexDirection: 'row' | 'column'
  gap: number
  position: string
  top?: number
  left?: number
  right?: number
  bottom?: number
  objectFit?: string
}

export interface LayoutNode {
  node: PDFNode
  x: number
  y: number
  width: number
  height: number
  style: ResolvedStyle
  children: LayoutNode[]
  textContent?: string
}
