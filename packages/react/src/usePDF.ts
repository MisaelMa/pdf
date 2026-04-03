import { useState, useEffect, useRef, useCallback } from 'react'
import type { PDFNode } from '@pdf.js/core'
import { renderToBlob } from '@pdf.js/core'

export interface UsePDFReturn {
  url: string
  blob: Blob | null
  loading: boolean
  error: Error | null
  refresh: () => void
}

/**
 * React hook for reactive PDF generation.
 *
 * @param factory  Function that builds and returns a core Document node.
 * @param deps     Dependency array — PDF re-renders when any value changes.
 *
 * @example
 * ```tsx
 * const { url, loading } = usePDF(
 *   () => Document({ title }, [Page({}, [Text({}, title)])]),
 *   [title],
 * )
 * ```
 */
export function usePDF(
  factory: () => PDFNode,
  deps: readonly unknown[] = [],
): UsePDFReturn {
  const [url, setUrl] = useState('')
  const [blob, setBlob] = useState<Blob | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const urlRef = useRef('')
  const versionRef = useRef(0)

  const generate = useCallback(async () => {
    const v = ++versionRef.current
    setLoading(true)
    setError(null)

    try {
      const doc = factory()
      const pdfBlob = await renderToBlob(doc)
      if (v !== versionRef.current) return

      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
      const newUrl = URL.createObjectURL(pdfBlob)
      urlRef.current = newUrl
      setUrl(newUrl)
      setBlob(pdfBlob)
    } catch (e) {
      if (v !== versionRef.current) return
      setError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      if (v === versionRef.current) setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generate])

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    }
  }, [])

  return { url, blob, loading, error, refresh: generate }
}
