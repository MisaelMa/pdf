import {
  defineComponent,
  h,
  ref,
  type PropType,
} from 'vue'
import type { PDFNode } from '@pdf.js/core'
import { renderToBlob } from '@pdf.js/core'

/**
 * Renders a clickable link that generates and downloads a PDF on click.
 *
 * @example
 * ```vue
 * <PDFDownloadLink :document="myDocNode" fileName="report.pdf">
 *   Download PDF
 * </PDFDownloadLink>
 * ```
 */
export const PDFDownloadLink = defineComponent({
  name: 'PDFDownloadLink',

  props: {
    document: {
      type: Object as PropType<PDFNode>,
      required: true,
    },
    fileName: { type: String, default: 'document.pdf' },
  },

  setup(props, { slots }) {
    const loading = ref(false)

    async function handleClick(e: Event) {
      e.preventDefault()
      if (loading.value) return
      loading.value = true

      try {
        const blob = await renderToBlob(props.document)
        const url = URL.createObjectURL(blob)
        const a = globalThis.document.createElement('a')
        a.href = url
        a.download = props.fileName
        a.click()
        URL.revokeObjectURL(url)
      } finally {
        loading.value = false
      }
    }

    return () =>
      h(
        'a',
        {
          href: '#',
          onClick: handleClick,
          style: { cursor: loading.value ? 'wait' : 'pointer' },
        },
        slots.default
          ? slots.default({ loading: loading.value })
          : loading.value
            ? 'Generating...'
            : 'Download PDF',
      )
  },
})
