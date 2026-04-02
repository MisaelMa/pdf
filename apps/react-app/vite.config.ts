import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
