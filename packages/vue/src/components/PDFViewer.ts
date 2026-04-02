import {
  defineComponent,
  h,
  ref,
  watch,
  nextTick,
  getCurrentInstance,
  onMounted,
  onScopeDispose,
  type PropType,
  type VNode,
} from 'vue'
import { renderToBlob } from '@pdfcraft/core'
import { buildPDFTree } from '../tree-builder'

export const PDFViewer = defineComponent({
  name: 'PDFViewer',

  props: {
    url: { type: String, default: '' },
    loading: { type: Boolean, default: undefined },
    width: { type: [String, Number], default: '100%' },
    height: { type: [String, Number], default: '100%' },
    showToolbar: { type: Boolean, default: true },
    deps: { type: [Array, Object, String, Number] as PropType<any>, default: undefined },
  },

  setup(props, { slots }) {
    const instance = getCurrentInstance()!
    const pdfUrl = ref('')
    const pdfLoading = ref(false)
    const pdfError = ref('')
    let blobUrl = ''
    let generation = 0
    let lastTreeKey = ''

    function getSlotVNodes(): VNode[] | null {
      const children = instance.vnode.children as any
      if (children?.default && typeof children.default === 'function') {
        const result = children.default()
        if (Array.isArray(result) && result.length > 0) return result
      }
      const fallback = slots.default?.()
      return fallback && fallback.length > 0 ? fallback : null
    }

    function generatePDF(docNode: any) {
      const gen = ++generation
      pdfLoading.value = true
      pdfError.value = ''

      renderToBlob(docNode)
        .then((blob) => {
          if (gen !== generation) return
          if (blobUrl) URL.revokeObjectURL(blobUrl)
          blobUrl = URL.createObjectURL(blob)
          pdfUrl.value = blobUrl
          pdfLoading.value = false
        })
        .catch((err) => {
          console.error('[PDFViewer] renderToBlob error:', err)
          if (gen === generation) {
            pdfLoading.value = false
            pdfError.value = String(err?.message || err)
          }
        })
    }

    function rebuild() {
      const vnodes = getSlotVNodes()
      if (!vnodes) return

      const docNode = buildPDFTree(vnodes)
      if (!docNode) return

      const key = JSON.stringify(docNode)
      if (key === lastTreeKey) return
      lastTreeKey = key

      generatePDF(docNode)
    }

    onMounted(rebuild)

    watch(
      () => props.deps,
      () => nextTick(rebuild),
      { deep: true },
    )

    onScopeDispose(() => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    })

    return () => {
      // Evaluate slots in render to catch HMR updates —
      // during HMR Vue bypasses stable-slot caching so we get fresh VNodes.
      const vnodes = getSlotVNodes()
      if (vnodes) {
        const docNode = buildPDFTree(vnodes)
        if (docNode) {
          const key = JSON.stringify(docNode)
          if (key !== lastTreeKey) {
            lastTreeKey = key
            queueMicrotask(() => generatePDF(docNode))
          }
        }
      }

      const effectiveUrl = props.url || pdfUrl.value
      const isLoading =
        props.loading !== undefined ? props.loading : pdfLoading.value
      const w =
        typeof props.width === 'number' ? `${props.width}px` : props.width
      const ht =
        typeof props.height === 'number' ? `${props.height}px` : props.height

      if (isLoading) {
        return h(
          'div',
          {
            style: {
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: w, height: ht,
              backgroundColor: '#f5f5f5', color: '#666',
              fontFamily: 'system-ui, sans-serif', fontSize: '14px',
              borderRadius: '4px',
            },
          },
          'Generating PDF…',
        )
      }

      if (pdfError.value) {
        return h(
          'div',
          {
            style: {
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: w, height: ht,
              backgroundColor: '#fef2f2', color: '#b91c1c',
              fontFamily: 'system-ui, sans-serif', fontSize: '13px',
              borderRadius: '4px', border: '1px solid #fca5a5',
              padding: '16px', textAlign: 'center',
            },
          },
          `PDF Error: ${pdfError.value}`,
        )
      }

      if (!effectiveUrl) {
        return h(
          'div',
          {
            style: {
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: w, height: ht,
              backgroundColor: '#fafafa', color: '#999',
              fontFamily: 'system-ui, sans-serif', fontSize: '14px',
              borderRadius: '4px', border: '1px dashed #ddd',
            },
          },
          'No PDF document',
        )
      }

      const src = props.showToolbar ? effectiveUrl : `${effectiveUrl}#toolbar=0`

      return h('iframe', {
        src,
        style: { width: w, height: ht, border: 'none' },
        title: 'PDF Viewer',
      })
    }
  },
})
