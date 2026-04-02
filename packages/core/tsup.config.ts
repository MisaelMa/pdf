import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  external: ['fs', 'fs/promises', 'path', 'stream', 'zlib', 'crypto', 'yoga-layout', 'yoga-layout/load'],
})
