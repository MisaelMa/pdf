import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { pdfkitBrowser } from '@pdfcraft/vite-plugin'

export default defineConfig({
  plugins: [pdfkitBrowser(), react()],
})
