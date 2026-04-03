import { defineComponent, type PropType } from 'vue'
import type { PDFStyle, PageSize, PageOrientation } from '@pdf.js/core'

function pdfComponent(
  name: string,
  pdfType: string,
  propDefs: Record<string, any>,
) {
  const comp = defineComponent({
    name,
    props: propDefs,
    setup(_, { slots }) {
      return () => slots.default?.() ?? null
    },
  })
  ;(comp as any).__pdfType = pdfType
  return comp
}

const styleProp = {
  style: {
    type: [Object, Array] as PropType<PDFStyle | PDFStyle[]>,
    default: undefined,
  },
}

export const PDFDocument = pdfComponent('PDFDocument', 'DOCUMENT', {
  title: String,
  author: String,
  subject: String,
  keywords: String,
  creator: String,
  producer: String,
  pdfVersion: String,
  language: String,
})

export const PDFPage = pdfComponent('PDFPage', 'PAGE', {
  size: {
    type: [String, Array, Object] as PropType<PageSize>,
    default: 'A4',
  },
  orientation: {
    type: String as PropType<PageOrientation>,
    default: undefined,
  },
  wrap: { type: Boolean, default: true },
  dpi: { type: Number, default: undefined },
  ...styleProp,
})

export const PDFView = pdfComponent('PDFView', 'VIEW', {
  wrap: { type: Boolean, default: true },
  fixed: { type: Boolean, default: false },
  ...styleProp,
})

export const PDFText = pdfComponent('PDFText', 'TEXT', {
  wrap: { type: Boolean, default: true },
  fixed: { type: Boolean, default: false },
  ...styleProp,
})

export const PDFImage = pdfComponent('PDFImage', 'IMAGE', {
  src: {
    type: [String, Object] as PropType<string | ArrayBuffer | Uint8Array>,
    required: true,
  },
  fixed: { type: Boolean, default: false },
  cache: { type: Boolean, default: true },
  ...styleProp,
})

export const PDFLink = pdfComponent('PDFLink', 'LINK', {
  src: { type: String, required: true },
  wrap: { type: Boolean, default: true },
  fixed: { type: Boolean, default: false },
  ...styleProp,
})

function pdfTableComponent(
  name: string,
  hint: string,
  propDefs: Record<string, any>,
) {
  const comp = pdfComponent(name, 'VIEW', propDefs)
  ;(comp as any).__pdfTableHint = hint
  return comp
}

export const PDFTable = pdfTableComponent('PDFTable', 'TABLE', {
  wrap: { type: Boolean, default: true },
  ...styleProp,
})

export const PDFTableRow = pdfTableComponent('PDFTableRow', 'TABLE_ROW', {
  ...styleProp,
})

export const PDFTableCell = pdfTableComponent('PDFTableCell', 'TABLE_CELL', {
  colSpan: { type: Number, default: 1 },
  ...styleProp,
})
