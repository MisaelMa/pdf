import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { pdfcraftBrowser } from '@pdf.js/vite-plugin'

export default defineConfig({
  plugins: [pdfcraftBrowser(), vue()],
  optimizeDeps: {
    include: ['pdfjs-dist'],
  },
})
