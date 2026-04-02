import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      stream: 'readable-stream',
      zlib: 'browserify-zlib',
      assert: 'assert/',
      util: 'util/',
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['buffer', 'process', 'pdfkit', 'assert', 'util'],
    esbuildOptions: {
      define: { global: 'globalThis' },
    },
  },
})
