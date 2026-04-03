import { pdfkitBrowser } from '@pdfcraft/vite-plugin'

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-01-01',

  vite: {
    plugins: [pdfkitBrowser()],
  },
})
