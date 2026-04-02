import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { createRequire } from 'module'
import type { Plugin } from 'vite'

/**
 * Vite plugin that makes pdfkit work in the browser by providing
 * a virtual fs module with pre-loaded AFM font data and an ICC profile.
 */
export function pdfkitBrowser(): Plugin {
  const require = createRequire(import.meta.url)
  const pdfkitDir = dirname(require.resolve('pdfkit/package.json'))
  const dataDir = resolve(pdfkitDir, 'js/data')

  const fontFiles = [
    'Courier.afm',
    'Courier-Bold.afm',
    'Courier-BoldOblique.afm',
    'Courier-Oblique.afm',
    'Helvetica.afm',
    'Helvetica-Bold.afm',
    'Helvetica-BoldOblique.afm',
    'Helvetica-Oblique.afm',
    'Times-Roman.afm',
    'Times-Bold.afm',
    'Times-BoldItalic.afm',
    'Times-Italic.afm',
    'Symbol.afm',
    'ZapfDingbats.afm',
  ]

  const fileMap: Record<string, string> = {}
  for (const name of fontFiles) {
    fileMap[name] = readFileSync(resolve(dataDir, name), 'utf-8')
  }

  const virtualFsCode = `
var __files = ${JSON.stringify(fileMap)};

export function readFileSync(path, opts) {
  var name = path.replace(/\\\\/g, '/').split('/').pop();
  if (__files[name] !== undefined) return __files[name];
  return '';
}
export function writeFileSync() {}
export function existsSync() { return false; }
export function createReadStream() { return null; }
export function createWriteStream() { return null; }
export default { readFileSync, writeFileSync, existsSync, createReadStream, createWriteStream };
`

  const VIRTUAL_FS_ID = '\0pdfkit-virtual-fs'

  return {
    name: 'pdfkit-browser',
    enforce: 'pre',

    resolveId(id) {
      if (id === 'fs' || id === 'node:fs') return VIRTUAL_FS_ID
    },

    load(id) {
      if (id === VIRTUAL_FS_ID) return virtualFsCode
    },

    config() {
      return {
        define: {
          global: 'globalThis',
          __dirname: '"/"',
          __filename: '""',
        },
        resolve: {
          alias: {
            stream: 'readable-stream',
            zlib: 'browserify-zlib',
            assert: 'assert/',
            util: 'util/',
          },
        },
        optimizeDeps: {
          include: ['buffer', 'process', 'assert', 'util'],
          esbuildOptions: {
            define: { global: 'globalThis', __dirname: '"/"', __filename: '""' },
            plugins: [
              {
                name: 'pdfkit-fs-stub',
                setup(build) {
                  build.onResolve({ filter: /^(fs|node:fs)$/ }, () => ({
                    path: 'pdfkit-virtual-fs',
                    namespace: 'pdfkit-ns',
                  }))
                  build.onLoad(
                    { filter: /.*/, namespace: 'pdfkit-ns' },
                    () => ({ contents: virtualFsCode, loader: 'js' }),
                  )
                },
              },
            ],
          },
        },
      }
    },
  }
}
