import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { pdfkitBrowser } from './vite-pdfkit-plugin'

export default defineConfig({
  plugins: [pdfkitBrowser(), vue()],
})
