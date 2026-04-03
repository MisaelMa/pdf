import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { pdfcraftBrowser } from '@pdf.js/vite-plugin'

export default defineConfig({
  plugins: [pdfcraftBrowser(), react()],
})
