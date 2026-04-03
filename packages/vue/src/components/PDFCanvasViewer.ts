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
import { renderToBlob } from '@pdf.js/core'
import { buildPDFTree } from '../tree-builder'

const STYLE_ID = '__pdfcv_css'
const CSS = [
  '@keyframes __pdfcv_spin{to{transform:rotate(360deg)}}',
  '.__pdfcv_tl{position:absolute;inset:0;overflow:clip;line-height:1;text-size-adjust:none;forced-color-adjust:none;z-index:2}',
  '.__pdfcv_tl :is(span,br){color:transparent;position:absolute;white-space:pre;transform-origin:0% 0%;pointer-events:all}',
  '.__pdfcv_tl ::selection{background:rgba(0,100,200,.25);mix-blend-mode:multiply}',
  '.__pdfcv_tl br::selection{background:transparent}',
  '.__pdfcv_tl .endOfContent{display:block;position:absolute;inset:100% 0 0;z-index:-1;cursor:default;user-select:none}',
  '.__pdfcv_tl .endOfContent.active{top:0}',
].join('\n')

function ensureCSS() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return
  const el = document.createElement('style')
  el.id = STYLE_ID
  el.textContent = CSS
  document.head.appendChild(el)
}

const btnBase: Record<string, string> = {
  width: '30px', height: '30px', display: 'inline-flex', alignItems: 'center',
  justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: '6px',
  background: '#fff', fontSize: '16px', cursor: 'pointer', color: '#374151',
  transition: 'all .15s',
}
const btnDisabled: Record<string, string> = { ...btnBase, opacity: '0.35', cursor: 'default' }
const lblStyle: Record<string, string> = {
  fontSize: '13px', color: '#64748b', minWidth: '56px', textAlign: 'center',
  fontVariantNumeric: 'tabular-nums', userSelect: 'none',
}
const grpStyle: Record<string, string> = { display: 'flex', alignItems: 'center', gap: '4px' }
const sepStyle: Record<string, string> = { width: '1px', height: '20px', background: '#e2e8f0' }

/**
 * Canvas-based PDF viewer with text selection support.
 *
 * Uses `pdfjs-dist` (optional peer dependency) to render PDF pages
 * onto a `<canvas>` with a transparent text layer overlay that enables
 * copy/paste — similar to [react-pdf](https://projects.wojtekmaj.pl/react-pdf/).
 *
 * Accepts the same declarative PDF components (`PDFDocument`, `PDFPage`, etc.)
 * as slot content, just like `PDFViewer`.
 *
 * @example
 * ```vue
 * <PDFCanvasViewer :deps="[title]">
 *   <PDFDocument :title="title">
 *     <PDFPage size="A4">
 *       <PDFText>{{ title }}</PDFText>
 *     </PDFPage>
 *   </PDFDocument>
 * </PDFCanvasViewer>
 * ```
 */
export const PDFCanvasViewer = defineComponent({
  name: 'PDFCanvasViewer',

  props: {
    width: { type: [String, Number], default: '100%' },
    height: { type: [String, Number], default: '100%' },
    deps: { type: [Array, Object, String, Number] as PropType<any>, default: undefined },
    showToolbar: { type: Boolean, default: true },
    initialScale: { type: Number, default: 1.5 },
    workerSrc: { type: String, default: '' },
  },

  emits: ['pageChange', 'scaleChange', 'rotationChange', 'loaded', 'error'],

  setup(props, { slots, emit }) {
    const instance = getCurrentInstance()!
    const containerRef = ref<HTMLDivElement>()
    const currentPage = ref(1)
    const totalPages = ref(0)
    const scale = ref(props.initialScale)
    const rotation = ref(0)
    const loading = ref(false)
    const pdfError = ref('')

    let pdfDoc: any = null
    let pdfjsLib: any = null
    let canvasEl: HTMLCanvasElement | null = null
    let textLayerEl: HTMLDivElement | null = null
    let textLayerObj: any = null
    let lastTreeKey = ''
    let generation = 0

    // ---- Slot evaluation (mirrors PDFViewer) ----

    function getSlotVNodes(): VNode[] | null {
      const children = instance.vnode.children as any
      if (children?.default && typeof children.default === 'function') {
        const result = children.default()
        if (Array.isArray(result) && result.length > 0) return result
      }
      const fallback = slots.default?.()
      return fallback && fallback.length > 0 ? fallback : null
    }

    // ---- pdfjs-dist lazy loader ----

    async function loadPdfjs() {
      if (pdfjsLib) return pdfjsLib
      try {
        pdfjsLib = await import(/* @vite-ignore */ 'pdfjs-dist')
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          props.workerSrc ||
          `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
        return pdfjsLib
      } catch {
        pdfError.value =
          'pdfjs-dist is required for PDFCanvasViewer. Install it with: npm install pdfjs-dist'
        return null
      }
    }

    // ---- PDF generation & canvas rendering ----

    async function generatePDF(docNode: any) {
      const gen = ++generation
      loading.value = true
      pdfError.value = ''

      try {
        const pdfjs = await loadPdfjs()
        if (!pdfjs || gen !== generation) return

        const blob = await renderToBlob(docNode)
        if (gen !== generation) return

        const buf = await blob.arrayBuffer()
        if (pdfDoc) pdfDoc.destroy()
        pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise
        totalPages.value = pdfDoc.numPages
        if (currentPage.value > totalPages.value) currentPage.value = 1
        emit('loaded', { totalPages: pdfDoc.numPages })
        await renderPage()
      } catch (e: any) {
        if (gen !== generation) return
        pdfError.value = e?.message || String(e)
        emit('error', e)
      } finally {
        if (gen === generation) loading.value = false
      }
    }

    async function renderPage() {
      const container = containerRef.value
      if (!pdfDoc || !container) return

      const pg = await pdfDoc.getPage(currentPage.value)
      const vp = pg.getViewport({ scale: scale.value, rotation: rotation.value })
      const dpr = window.devicePixelRatio || 1

      // Render canvas
      if (!canvasEl) canvasEl = document.createElement('canvas')
      canvasEl.width = Math.floor(vp.width * dpr)
      canvasEl.height = Math.floor(vp.height * dpr)
      canvasEl.style.display = 'block'
      canvasEl.style.width = `${Math.floor(vp.width)}px`
      canvasEl.style.height = `${Math.floor(vp.height)}px`
      const ctx = canvasEl.getContext('2d')!
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      await pg.render({ canvasContext: ctx, viewport: vp }).promise

      // Render text layer (enables select + copy, like react-pdf)
      if (textLayerObj?.cancel) textLayerObj.cancel()
      textLayerObj = null
      if (!textLayerEl) textLayerEl = document.createElement('div')
      textLayerEl.innerHTML = ''
      textLayerEl.style.width = `${Math.floor(vp.width)}px`
      textLayerEl.style.height = `${Math.floor(vp.height)}px`

      try {
        const tc = await pg.getTextContent()
        const TL = pdfjsLib?.TextLayer
        if (TL) {
          textLayerObj = new TL({
            textContentSource: tc,
            container: textLayerEl,
            viewport: vp,
          })
          await textLayerObj.render()
          const end = document.createElement('div')
          end.className = 'endOfContent'
          textLayerEl.append(end)
        }
      } catch {
        /* text layer is best-effort */
      }

      textLayerEl.classList.add('__pdfcv_tl')

      container.innerHTML = ''
      container.appendChild(canvasEl)
      container.appendChild(textLayerEl)
    }

    // ---- Tree rebuild (mirrors PDFViewer) ----

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

    onMounted(() => {
      ensureCSS()
      rebuild()
    })

    watch(() => props.deps, () => nextTick(rebuild), { deep: true })
    watch([scale, rotation], () => {
      if (pdfDoc) renderPage()
    })

    onScopeDispose(() => {
      if (pdfDoc) pdfDoc.destroy()
      if (textLayerObj?.cancel) textLayerObj.cancel()
    })

    // ---- Navigation helpers ----

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        emit('pageChange', currentPage.value)
        renderPage()
      }
    }
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        emit('pageChange', currentPage.value)
        renderPage()
      }
    }
    const zoomIn = () => {
      scale.value = Math.min(3, +(scale.value + 0.25).toFixed(2))
      emit('scaleChange', scale.value)
    }
    const zoomOut = () => {
      scale.value = Math.max(0.5, +(scale.value - 0.25).toFixed(2))
      emit('scaleChange', scale.value)
    }
    const rotateCW = () => {
      rotation.value = (rotation.value + 90) % 360
      emit('rotationChange', rotation.value)
    }

    // ---- Toolbar render helper ----

    function renderToolbar() {
      const bs = (disabled: boolean) => (disabled ? btnDisabled : btnBase)
      return h('div', { style: {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
        padding: '8px 16px', background: '#fff', borderTop: '1px solid #e2e8f0', flexShrink: '0',
      } }, [
        h('div', { style: grpStyle }, [
          h('button', { style: bs(currentPage.value <= 1), disabled: currentPage.value <= 1, onClick: prevPage }, '‹'),
          h('span', { style: lblStyle }, `${currentPage.value} / ${totalPages.value}`),
          h('button', { style: bs(currentPage.value >= totalPages.value), disabled: currentPage.value >= totalPages.value, onClick: nextPage }, '›'),
        ]),
        h('span', { style: sepStyle }),
        h('div', { style: grpStyle }, [
          h('button', { style: btnBase, onClick: zoomOut }, '−'),
          h('span', { style: lblStyle }, `${Math.round(scale.value * 100)}%`),
          h('button', { style: btnBase, onClick: zoomIn }, '+'),
        ]),
        h('span', { style: sepStyle }),
        h('div', { style: grpStyle }, [
          h('button', { style: btnBase, onClick: rotateCW, title: 'Rotate' }, '↻'),
          h('span', { style: lblStyle }, `${rotation.value}°`),
        ]),
      ])
    }

    // ---- Render function ----

    return () => {
      // Evaluate slots inside render to catch reactive changes + HMR
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

      const w = typeof props.width === 'number' ? `${props.width}px` : props.width
      const ht = typeof props.height === 'number' ? `${props.height}px` : props.height

      return h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', width: w, height: ht, overflow: 'hidden' } },
        [
          // Scrollable canvas area
          h('div', {
            style: {
              flex: '1', overflow: 'auto', display: 'flex', justifyContent: 'center',
              alignItems: 'flex-start', padding: '24px', background: '#f1f5f9',
            },
          }, [
            pdfError.value
              ? h('div', {
                  style: {
                    padding: '24px', color: '#dc2626', background: '#fef2f2',
                    borderRadius: '8px', fontFamily: 'monospace', maxWidth: '600px',
                  },
                }, [
                  h('strong', null, 'Error'),
                  h('pre', { style: { margin: '8px 0 0', whiteSpace: 'pre-wrap', fontSize: '12px' } }, pdfError.value),
                ])
              : h('div', {
                  style: {
                    position: 'relative', lineHeight: '0',
                    boxShadow: '0 4px 20px rgba(0,0,0,.12),0 1px 4px rgba(0,0,0,.08)',
                    borderRadius: '2px',
                  },
                }, [
                  loading.value
                    ? h('div', {
                        style: {
                          position: 'absolute', inset: '0', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(255,255,255,.75)', zIndex: '10', borderRadius: '2px',
                        },
                      }, [
                        h('div', {
                          style: {
                            width: '32px', height: '32px', border: '3px solid #e2e8f0',
                            borderTopColor: '#6366f1', borderRadius: '50%',
                            animation: '__pdfcv_spin .7s linear infinite',
                          },
                        }),
                      ])
                    : null,
                  h('div', { ref: containerRef, style: { position: 'relative' } }),
                ]),
          ]),

          // Toolbar
          props.showToolbar ? renderToolbar() : null,
        ],
      )
    }
  },
})
