import type { PDFStyle, ResolvedStyle } from './types'

export const StyleSheet = {
  create<T extends Record<string, PDFStyle>>(styles: T): T {
    return styles
  },
}

export function resolveStyle(style?: PDFStyle | PDFStyle[]): ResolvedStyle {
  const merged = mergeStyles(style)

  return {
    marginTop:
      merged.marginTop ?? merged.marginVertical ?? merged.margin ?? 0,
    marginRight:
      merged.marginRight ?? merged.marginHorizontal ?? merged.margin ?? 0,
    marginBottom:
      merged.marginBottom ?? merged.marginVertical ?? merged.margin ?? 0,
    marginLeft:
      merged.marginLeft ?? merged.marginHorizontal ?? merged.margin ?? 0,
    paddingTop:
      merged.paddingTop ?? merged.paddingVertical ?? merged.padding ?? 0,
    paddingRight:
      merged.paddingRight ?? merged.paddingHorizontal ?? merged.padding ?? 0,
    paddingBottom:
      merged.paddingBottom ?? merged.paddingVertical ?? merged.padding ?? 0,
    paddingLeft:
      merged.paddingLeft ?? merged.paddingHorizontal ?? merged.padding ?? 0,
    fontSize: merged.fontSize ?? 12,
    fontFamily: merged.fontFamily ?? 'Helvetica',
    fontWeight: merged.fontWeight,
    fontStyle: merged.fontStyle,
    color: merged.color ?? '#000000',
    backgroundColor: merged.backgroundColor,
    textAlign: merged.textAlign ?? 'left',
    lineHeight: merged.lineHeight,
    letterSpacing: merged.letterSpacing,
    textDecoration: merged.textDecoration,
    textTransform: merged.textTransform,
    borderWidth: merged.borderWidth ?? 0,
    borderColor: merged.borderColor ?? '#000000',
    borderRadius: merged.borderRadius ?? 0,
    borderStyle: merged.borderStyle ?? 'solid',
    opacity: merged.opacity ?? 1,
    width: typeof merged.width === 'number' ? merged.width : undefined,
    height: typeof merged.height === 'number' ? merged.height : undefined,
    flexDirection: merged.flexDirection ?? 'column',
    gap: merged.gap ?? merged.rowGap ?? 0,
    position: merged.position ?? 'relative',
    top: merged.top,
    left: merged.left,
    right: merged.right,
    bottom: merged.bottom,
    objectFit: merged.objectFit,
  }
}

function mergeStyles(style?: PDFStyle | PDFStyle[]): PDFStyle {
  if (!style) return {}
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.filter(Boolean)) as PDFStyle
  }
  return style
}
