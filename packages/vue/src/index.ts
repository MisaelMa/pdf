// Composables
export { usePDF } from './composables/usePDF'

// Viewer & download
export { PDFViewer } from './components/PDFViewer'
export { PDFDownloadLink } from './components/PDFDownloadLink'

// Declarative PDF components
export {
  PDFDocument,
  PDFPage,
  PDFView,
  PDFText,
  PDFImage,
  PDFLink,
} from './components/pdf-components'

// Tree builder (advanced usage)
export { buildPDFTree } from './tree-builder'

// Re-export core node creators & utilities
export {
  Document,
  Page,
  View,
  Text,
  Image,
  Link,
  StyleSheet,
  Font,
  renderToBuffer,
  renderToStream,
  renderToBlob,
  renderToFile,
} from '@pdfcraft/core'

export type {
  PDFNode,
  PDFChild,
  PDFStyle,
  PageSize,
  PageOrientation,
  DocumentProps,
  PageProps,
  ViewProps,
  TextProps,
  ImageProps,
  LinkProps,
} from '@pdfcraft/core'
