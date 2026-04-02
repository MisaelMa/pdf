import type { PageSize, PageOrientation } from './types'

const SIZES: Record<string, [number, number]> = {
  A0: [2383.94, 3370.39],
  A1: [1683.78, 2383.94],
  A2: [1190.55, 1683.78],
  A3: [841.89, 1190.55],
  A4: [595.28, 841.89],
  A5: [419.53, 595.28],
  A6: [297.64, 419.53],
  B0: [2834.65, 4008.19],
  B1: [2004.09, 2834.65],
  B2: [1417.32, 2004.09],
  B3: [1000.63, 1417.32],
  B4: [708.66, 1000.63],
  B5: [498.90, 708.66],
  LETTER: [612, 792],
  LEGAL: [612, 1008],
  TABLOID: [792, 1224],
  EXECUTIVE: [521.86, 756],
  FOLIO: [612, 936],
}

export interface PageDimensions {
  width: number
  height: number
}

export function resolvePageSize(
  size?: PageSize,
  orientation?: PageOrientation,
): PageDimensions {
  let width: number
  let height: number

  if (!size || typeof size === 'string') {
    const key = (size || 'A4').toUpperCase()
    const dims = SIZES[key]
    if (!dims) {
      throw new Error(`Unknown page size: ${size}. Use one of: ${Object.keys(SIZES).join(', ')}`)
    }
    ;[width, height] = dims
  } else if (Array.isArray(size)) {
    ;[width, height] = size
  } else {
    width = size.width
    height = size.height
  }

  if (orientation === 'landscape' && height > width) {
    ;[width, height] = [height, width]
  } else if (orientation === 'portrait' && width > height) {
    ;[width, height] = [height, width]
  }

  return { width, height }
}
