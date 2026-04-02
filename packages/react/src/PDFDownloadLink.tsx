import { useState, type ReactNode } from 'react'
import type { PDFNode } from '@pdfcraft/core'
import { renderToBlob } from '@pdfcraft/core'

export interface PDFDownloadLinkProps {
  document: PDFNode
  fileName?: string
  children?: ReactNode | ((state: { loading: boolean }) => ReactNode)
  className?: string
  style?: React.CSSProperties
}

export function PDFDownloadLink({
  document: docNode,
  fileName = 'document.pdf',
  children,
  className,
  style,
}: PDFDownloadLinkProps) {
  const [loading, setLoading] = useState(false)

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    try {
      const blob = await renderToBlob(docNode)
      const url = URL.createObjectURL(blob)
      const a = globalThis.document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  const content =
    typeof children === 'function'
      ? children({ loading })
      : children ?? (loading ? 'Generating…' : 'Download PDF')

  return (
    <a
      href="#"
      onClick={handleClick}
      className={className}
      style={{ cursor: loading ? 'wait' : 'pointer', ...style }}
    >
      {content}
    </a>
  )
}
