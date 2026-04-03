export { usePDF } from './usePDF'
export type { UsePDFReturn } from './usePDF'

// Re-export core for convenience
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
  TableProps,
  TableRowProps,
  TableCellProps,
} from '@pdfcraft/core'
