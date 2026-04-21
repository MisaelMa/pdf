// Composables
export { usePDF } from './composables/usePDF'

// Viewer & download
export { PDFViewer } from './components/PDFViewer'
export { PDFCanvasViewer } from './components/PDFCanvasViewer'
export { PDFDownloadLink } from './components/PDFDownloadLink'

// Declarative PDF components
export {
  PDFDocument,
  PDFPage,
  PDFView,
  PDFText,
  PDFImage,
  PDFLink,
  PDFTable,
  PDFTableRow,
  PDFTableCell,
  PDFInput,
  PDFCheckbox,
  PDFSelect,
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
  Table,
  TableRow,
  TableCell,
  Input,
  Checkbox,
  Select,
  StyleSheet,
  Font,
  renderToBuffer,
  renderToStream,
  renderToBlob,
  renderToFile,
} from '@pdf.js/core'

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
  TableProps,
  TableRowProps,
  TableCellProps,
  InputProps,
  CheckboxProps,
  SelectProps,
} from '@pdf.js/core'
