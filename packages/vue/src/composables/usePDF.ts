import {
  ref,
  shallowRef,
  watchEffect,
  onScopeDispose,
} from 'vue'
import type { PDFNode } from '@pdf.js/core'
import { renderToBlob } from '@pdf.js/core'

export interface UsePDFReturn {
  url: ReturnType<typeof ref<string>>
  blob: ReturnType<typeof shallowRef<Blob | null>>
  loading: ReturnType<typeof ref<boolean>>
  error: ReturnType<typeof ref<Error | null>>
  refresh: () => Promise<void>
}

/**
 * Reactive PDF generation composable.
 *
 * Pass a function that returns a core Document node.
 * Any reactive dependencies accessed inside `documentFn`
 * are tracked automatically — the PDF re-renders when they change.
 *
 * @example
 * ```ts
 * const title = ref('Hello')
 * const { url, loading } = usePDF(() =>
 *   Document({ title: title.value }, [
 *     Page({}, [ Text({}, title.value) ])
 *   ])
 * )
 * ```
 */
export function usePDF(documentFn: () => PDFNode): UsePDFReturn {
  const url = ref('')
  const blob = shallowRef<Blob | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  let currentUrl = ''
  let version = 0

  async function generate(doc: PDFNode) {
    const v = ++version
    loading.value = true
    error.value = null

    try {
      const pdfBlob = await renderToBlob(doc)
      if (v !== version) return

      if (currentUrl) URL.revokeObjectURL(currentUrl)
      blob.value = pdfBlob
      currentUrl = URL.createObjectURL(pdfBlob)
      url.value = currentUrl
    } catch (e) {
      if (v !== version) return
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      if (v === version) loading.value = false
    }
  }

  async function refresh() {
    const doc = documentFn()
    await generate(doc)
  }

  watchEffect(() => {
    const doc = documentFn()
    generate(doc)
  })

  onScopeDispose(() => {
    if (currentUrl) URL.revokeObjectURL(currentUrl)
  })

  return { url, blob, loading, error, refresh }
}
