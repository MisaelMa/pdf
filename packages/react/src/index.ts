// Declarative PDF components
export {
  Document,
  Page,
  View,
  Text,
  Image,
  Link,
} from './components'

// Viewer, hook & download
export { usePDF } from './usePDF'
export { PDFViewer } from './PDFViewer'
export { PDFDownloadLink } from './PDFDownloadLink'
export { buildPDFTree } from './tree-builder'

// Re-export non-conflicting core utilities
export {
  StyleSheet,
  Font,
  renderToBuffer,
  renderToStream,
  renderToBlob,
  renderToFile,
} from '@pdfcraft/core'

// Re-export types
export type {
  PDFNode,
  PDFChild,
  PDFStyle,
  PageSize,
  PageOrientation,
} from '@pdfcraft/core'

export type { UsePDFReturn } from './usePDF'
export type { PDFViewerProps } from './PDFViewer'
export type { PDFDownloadLinkProps } from './PDFDownloadLink'
export type {
  DocumentProps,
  PageProps,
  ViewProps,
  TextComponentProps,
  ImageComponentProps,
  LinkComponentProps,
} from './components'
