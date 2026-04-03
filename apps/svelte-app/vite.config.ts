import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { pdfcraftBrowser } from '@pdf.js/vite-plugin'

export default defineConfig({
  plugins: [pdfcraftBrowser(), svelte()],
})
