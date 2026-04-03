import { writable, type Writable, type Readable } from 'svelte/store'
import type { PDFNode } from '@pdf.js/core'
import { renderToBlob } from '@pdf.js/core'

export interface UsePDFReturn {
  url: Readable<string>
  blob: Readable<Blob | null>
  loading: Readable<boolean>
  error: Readable<Error | null>
  refresh: () => Promise<void>
  destroy: () => void
}

/**
 * Svelte store-based PDF generation.
 *
 * Returns readable stores for url, loading, error, and a refresh function.
 * Call `destroy()` when the component unmounts to revoke the blob URL.
 *
 * @example
 * ```svelte
 * <script>
 *   import { usePDF, Document, Page, Text } from '@pdf.js/svelte'
 *   import { onDestroy } from 'svelte'
 *
 *   const { url, loading, destroy } = usePDF(() =>
 *     Document({}, [Page({}, [Text({}, 'Hello')])])
 *   )
 *   onDestroy(destroy)
 * </script>
 *
 * {#if $loading}
 *   <p>Generating...</p>
 * {:else}
 *   <iframe src={$url} title="PDF" />
 * {/if}
 * ```
 */
export function usePDF(factory: () => PDFNode): UsePDFReturn {
  const url: Writable<string> = writable('')
  const blob: Writable<Blob | null> = writable(null)
  const loading: Writable<boolean> = writable(false)
  const error: Writable<Error | null> = writable(null)

  let currentUrl = ''
  let version = 0

  async function refresh() {
    const v = ++version
    loading.set(true)
    error.set(null)

    try {
      const doc = factory()
      const pdfBlob = await renderToBlob(doc)
      if (v !== version) return

      if (currentUrl) URL.revokeObjectURL(currentUrl)
      currentUrl = URL.createObjectURL(pdfBlob)
      url.set(currentUrl)
      blob.set(pdfBlob)
    } catch (e) {
      if (v !== version) return
      error.set(e instanceof Error ? e : new Error(String(e)))
    } finally {
      if (v === version) loading.set(false)
    }
  }

  function destroy() {
    if (currentUrl) URL.revokeObjectURL(currentUrl)
    currentUrl = ''
  }

  refresh()

  return {
    url: { subscribe: url.subscribe },
    blob: { subscribe: blob.subscribe },
    loading: { subscribe: loading.subscribe },
    error: { subscribe: error.subscribe },
    refresh,
    destroy,
  }
}
