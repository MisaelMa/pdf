import type {
  PDFNode,
  PDFChild,
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
} from './types'

export function Document(
  props: DocumentProps,
  children: PDFChild[],
): PDFNode {
  return { type: 'DOCUMENT', props, children: children.flat() }
}

export function Page(
  props: PageProps = {},
  children: PDFChild[] = [],
): PDFNode {
  return { type: 'PAGE', props, children: children.flat() }
}

export function View(
  props: ViewProps = {},
  children: PDFChild[] = [],
): PDFNode {
  return { type: 'VIEW', props, children: children.flat() }
}

export function Text(
  props: TextProps = {},
  children: PDFChild | PDFChild[] = [],
): PDFNode {
  const normalized = Array.isArray(children) ? children.flat() : [children]
  return { type: 'TEXT', props, children: normalized }
}

export function Image(props: ImageProps): PDFNode {
  return { type: 'IMAGE', props, children: [] }
}

export function Link(
  props: LinkProps,
  children: PDFChild[] = [],
): PDFNode {
  return { type: 'LINK', props, children: children.flat() }
}

export function Table(
  props: TableProps = {},
  children: PDFChild[] = [],
): PDFNode {
  const mergedStyle = {
    flexDirection: 'column' as const,
    ...(props.style && !Array.isArray(props.style) ? props.style : {}),
  }
  return { type: 'VIEW', props: { ...props, style: mergedStyle }, children: children.flat() }
}

export function TableRow(
  props: TableRowProps = {},
  children: PDFChild[] = [],
): PDFNode {
  const mergedStyle = {
    flexDirection: 'row' as const,
    ...(props.style && !Array.isArray(props.style) ? props.style : {}),
  }
  return { type: 'VIEW', props: { ...props, style: mergedStyle }, children: children.flat() }
}

export function TableCell(
  props: TableCellProps = {},
  children: PDFChild | PDFChild[] = [],
): PDFNode {
  const colSpan = props.colSpan || 1
  const mergedStyle = {
    flex: colSpan,
    padding: 6,
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    ...(props.style && !Array.isArray(props.style) ? props.style : {}),
  }
  const normalized = Array.isArray(children) ? children.flat() : [children]
  return { type: 'VIEW', props: { ...props, style: mergedStyle }, children: normalized }
}

export function Input(props: InputProps): PDFNode {
  return { type: 'INPUT', props, children: [] }
}

export function Checkbox(props: CheckboxProps): PDFNode {
  return { type: 'CHECKBOX', props, children: [] }
}

export function Select(props: SelectProps): PDFNode {
  return { type: 'SELECT', props, children: [] }
}
