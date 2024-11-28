import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import ignore from "rollup-plugin-ignore";
import inject from "rollup-plugin-inject";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import nodeResolve from "@rollup/plugin-node-resolve";
// https://nuxt.com/docs/api/configuration/nuxt-config
import { replaceCodePlugin } from "vite-plugin-replace";
import { resolve} from 'path'


export default defineNuxtConfig({
 devtools: { enabled: true },
 srcDir: "src",

 experimental: {
   externalVue: true,
 },
 alias: { 
  '@pdf.js/vue': resolve('node_modules', '@pdf.js/vue/src') 
 },

 vite: {
   plugins: [
     inject({
       include: "./src/**/*.vue", // Restringe el complemento a archivos con extensión .vue
       // Otras opciones del complemento aquí...
     }),
     alias({
       entries: [
         { find: "stream", replacement: "vite-compatible-readable-stream" },
         { find: "zlib", replacement: "browserify-zlib" },
       ],
     }),
     /*    commonjs(),
     nodeResolve({ browser: true, preferBuiltins: false }), */
    /*  nodePolyfills({
       // To exclude specific polyfills, add them to this list.
       exclude: [
         "fs", // Excludes the polyfill for `fs` and `node:fs`.
       ],
       // Whether to polyfill specific globals.
       globals: {
         Buffer: true, // can also be 'build', 'dev', or false
         global: true,
         process: true,
       },
       // Whether to polyfill `node:` protocol imports.
       protocolImports: true,
     }), */

     /* nodePolyfills({
       include: [/node_modules\/.+\.js/, /pdfkit\/src\/.*\.js/],
     }), */
   ],
 },

 compatibilityDate: "2024-10-10",
});

/* alias({
  entries: [
    { find: "stream", replacement: "vite-compatible-readable-stream" },
    { find: "zlib", replacement: "browserify-zlib" },
  ],
});
 */