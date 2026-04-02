import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { pdfkitBrowser } from '@pdfcraft/vite-plugin'

export default defineConfig({
  plugins: [pdfkitBrowser(), vue()],
})
