import type { Plugin } from 'vite'

/**
 * Vite plugin for PDFCraft browser compatibility.
 *
 * With pdf-lib as the rendering engine, most Node.js polyfills are no
 * longer needed. This plugin only configures minimal settings for
 * browser compatibility (global definitions).
 *
 * @example
 * ```ts
 * import { pdfcraftBrowser } from '@pdf.js/vite-plugin'
 * import vue from '@vitejs/plugin-vue'
 *
 * export default defineConfig({
 *   plugins: [pdfcraftBrowser(), vue()],
 * })
 * ```
 */
export function pdfcraftBrowser(): Plugin {
  return {
    name: 'pdfcraft-browser',
    config() {
      return {
        define: {
          global: 'globalThis',
        },
      }
    },
  }
}
