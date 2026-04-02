import type {
  PDFNode,
  PDFChild,
  DocumentProps,
  PageProps,
  ViewProps,
  TextProps,
  ImageProps,
  LinkProps,
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
