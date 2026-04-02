import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { pdfkitBrowser } from '@pdfcraft/vite-plugin'

export default defineConfig({
  plugins: [pdfkitBrowser(), svelte()],
})
