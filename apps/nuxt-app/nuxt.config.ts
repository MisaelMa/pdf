export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-01-01',

  vite: {
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
  },
})
