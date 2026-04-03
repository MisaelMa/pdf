import { pdfcraftBrowser } from '@pdf.js/vite-plugin'

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-01-01',

  vite: {
    plugins: [pdfcraftBrowser()],
    optimizeDeps: {
      include: ['pdfjs-dist'],
    },
  },
})
