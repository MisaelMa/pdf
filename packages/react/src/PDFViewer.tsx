import { useState, useEffect, useRef, useMemo, type CSSProperties, type ReactNode } from 'react'
import { renderToBlob } from '@pdf.js/core'
import { buildPDFTree } from './tree-builder'

export interface PDFViewerProps {
  /** Blob URL — used with `usePDF()`. Ignored when children are provided. */
  url?: string
  /** Override loading state (only for URL mode). */
  loading?: boolean
  width?: string | number
  height?: string | number
  style?: CSSProperties
  showToolbar?: boolean
  /**
   * Declarative mode — nest `<Document>`, `<Page>`, `<Text>` etc. as children
   * and the viewer builds + renders the PDF automatically.
   */
  children?: ReactNode
}

/**
 * Displays a PDF inside an iframe.
 *
 * **URL mode** (with `usePDF`):
 * ```tsx
 * <PDFViewer url={url} loading={loading} />
 * ```
 *
 * **Declarative mode**:
 * ```tsx
 * <PDFViewer>
 *   <Document><Page><Text>Hello</Text></Page></Document>
 * </PDFViewer>
 * ```
 */
export function PDFViewer({
  url: urlProp,
  loading: loadingProp,
  width = '100%',
  height = '100%',
  style,
  showToolbar = true,
  children,
}: PDFViewerProps) {
  const [internalUrl, setInternalUrl] = useState('')
  const [internalLoading, setInternalLoading] = useState(false)
  const urlRef = useRef('')
  const versionRef = useRef(0)

  // Declarative mode: build core tree from React element children
  const docNode = useMemo(() => {
    if (!children) return null
    return buildPDFTree(children)
  }, [children])

  const treeKey = useMemo(
    () => (docNode ? JSON.stringify(docNode) : ''),
    [docNode],
  )

  useEffect(() => {
    if (!docNode) return

    const v = ++versionRef.current
    setInternalLoading(true)

    renderToBlob(docNode)
      .then((blob) => {
        if (v !== versionRef.current) return
        if (urlRef.current) URL.revokeObjectURL(urlRef.current)
        urlRef.current = URL.createObjectURL(blob)
        setInternalUrl(urlRef.current)
        setInternalLoading(false)
      })
      .catch(() => {
        if (v === versionRef.current) setInternalLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeKey])

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    }
  }, [])

  const effectiveUrl = urlProp || internalUrl
  const isLoading = loadingProp !== undefined ? loadingProp : internalLoading

  const cssWidth = typeof width === 'number' ? `${width}px` : width
  const cssHeight = typeof height === 'number' ? `${height}px` : height

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: cssWidth,
          height: cssHeight,
          backgroundColor: '#f5f5f5',
          color: '#666',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '14px',
          borderRadius: '4px',
          ...style,
        }}
      >
        Generating PDF…
      </div>
    )
  }

  if (!effectiveUrl) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: cssWidth,
          height: cssHeight,
          backgroundColor: '#fafafa',
          color: '#999',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '14px',
          borderRadius: '4px',
          border: '1px dashed #ddd',
          ...style,
        }}
      >
        No PDF document
      </div>
    )
  }

  const src = showToolbar ? effectiveUrl : `${effectiveUrl}#toolbar=0`

  return (
    <iframe
      src={src}
      title="PDF Viewer"
      style={{
        width: cssWidth,
        height: cssHeight,
        border: 'none',
        ...style,
      }}
    />
  )
}
