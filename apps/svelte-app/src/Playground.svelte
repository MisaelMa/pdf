<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import loader from '@monaco-editor/loader'
  import { transform } from 'sucrase'
  import {
    Document,
    Page,
    View,
    Text,
    Image,
    Link,
    Table,
    TableRow,
    TableCell,
    StyleSheet,
    Font,
    renderToBlob,
  } from '@pdfcraft/svelte'
  import type { PDFNode } from '@pdfcraft/svelte'

  let editorContainer: HTMLDivElement
  let pdfUrl = $state('')
  let error = $state('')
  let loading = $state(false)
  let blobUrl = ''
  let editorInstance: any = null
  let debounceTimer: ReturnType<typeof setTimeout>
  let generation = 0

  const DEFAULT_CODE = `const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#ffffff' },
  header: { fontSize: 26, fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 11, fontStyle: 'italic', color: '#94a3b8', textAlign: 'center', marginBottom: 24 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  card: { flex: 1, padding: 14, backgroundColor: '#f8fafc', borderRadius: 6, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontSize: 12, fontWeight: 'bold', color: '#334155', marginBottom: 4 },
  cardText: { fontSize: 10, color: '#64748b', lineHeight: 1.5 },
  section: { marginBottom: 14, padding: 14, backgroundColor: '#f1f5f9', borderRadius: 6 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#334155', marginBottom: 4 },
  text: { fontSize: 10, color: '#475569', lineHeight: 1.5 },
  badge: { backgroundColor: '#6366f1', color: '#ffffff', fontSize: 8, padding: 4, paddingHorizontal: 10, borderRadius: 10 },
  footer: { fontSize: 8, color: '#94a3b8', textAlign: 'center', marginTop: 20 },
})

// JSX components or functional API — both work!
// Functional: Document({title:'...'}, [Page({}, [Text({}, 'Hi')])])

return (
  <Document title="PDFCraft Playground" author="PDFCraft">
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Hello PDFCraft!</Text>
      <Text style={styles.subtitle}>Edit this code and see the PDF update live</Text>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Flexbox Layout</Text>
          <Text style={styles.cardText}>
            Powered by Yoga engine — supports row, column, flex-grow, gap, alignItems, justifyContent and more.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Styled Text</Text>
          <Text style={styles.cardText}>
            Font sizes, weights, colors, line heights, text transforms, and decorations — all via a CSS-like API.
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 14 }}>
        <Text style={styles.badge}>Vue</Text>
        <Text style={styles.badge}>React</Text>
        <Text style={styles.badge}>Svelte</Text>
        <Text style={styles.badge}>SSR</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Try it out!</Text>
        <Text style={styles.text}>
          Change the text, add more Views, adjust styles — the PDF regenerates automatically.
        </Text>
      </View>

      <Text style={styles.footer}>PDFCraft Playground — pdfkit + yoga layout engine</Text>
    </Page>
  </Document>
)
`

  const CORE_TYPES = new Set([Document, Page, View, Text, Image, Link, Table, TableRow, TableCell])

  function createElement(type: any, props: any, ...children: any[]) {
    const flat = children.flat(Infinity).filter((c: any) => c != null && c !== true && c !== false)
    if (CORE_TYPES.has(type)) {
      const childArg = flat.length === 1 && typeof flat[0] === 'string' ? flat[0] : flat
      return type(props || {}, childArg)
    }
    if (typeof type === 'function') {
      return type({ ...(props || {}), children: flat })
    }
    return null
  }

  const ReactShim = { createElement, Fragment: ({ children }: any) => children }

  function compileAndRun(code: string): { tree: PDFNode | null; error: string | null } {
    try {
      const { code: transpiled } = transform(code, {
        transforms: ['typescript', 'jsx'],
        jsxRuntime: 'classic',
        production: true,
      })

      const scope = { React: ReactShim, Document, Page, View, Text, Image, Link, Table, TableRow, TableCell, StyleSheet, Font }
      const fn = new Function(...Object.keys(scope), `"use strict";\n${transpiled}`)
      const result = fn(...Object.values(scope))

      if (result && typeof result === 'object' && result.type === 'DOCUMENT') return { tree: result, error: null }
      return { tree: null, error: 'Code must return a <Document> or Document() node.' }
    } catch (err: any) {
      return { tree: null, error: err?.message || String(err) }
    }
  }

  async function generatePDF(code: string) {
    const gen = ++generation
    loading = true
    error = ''
    const { tree, error: compileError } = compileAndRun(code)
    if (compileError || !tree) {
      error = compileError || 'No document returned.'
      loading = false
      return
    }
    try {
      const blob = await renderToBlob(tree)
      if (gen !== generation) return
      if (blobUrl) URL.revokeObjectURL(blobUrl)
      blobUrl = URL.createObjectURL(blob)
      pdfUrl = blobUrl
      error = ''
    } catch (err: any) {
      if (gen !== generation) return
      error = err?.message || String(err)
    } finally {
      if (gen === generation) loading = false
    }
  }

  function onCodeChange(code: string) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => generatePDF(code), 800)
  }

  onMount(async () => {
    const monaco = await loader.init()
    if (!editorContainer) return
    editorInstance = monaco.editor.create(editorContainer, {
      value: DEFAULT_CODE,
      language: 'typescriptreact',
      theme: 'vs-dark',
      minimap: { enabled: false },
      fontSize: 13,
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      tabSize: 2,
      padding: { top: 12 },
      automaticLayout: true,
    })
    editorInstance.onDidChangeModelContent(() => onCodeChange(editorInstance.getValue()))
    generatePDF(DEFAULT_CODE)
  })

  onDestroy(() => {
    if (editorInstance) editorInstance.dispose()
    if (blobUrl) URL.revokeObjectURL(blobUrl)
    clearTimeout(debounceTimer)
  })
</script>

<div class="playground">
  <header class="playground-header">
    <div class="playground-logo">
      <h1>PDFCraft</h1>
      <span class="playground-tag">PLAYGROUND</span>
    </div>
    <div class="playground-actions">
      {#if loading}
        <span class="playground-status">Generating...</span>
      {/if}
      <button class="playground-btn" onclick={() => generatePDF(editorInstance?.getValue() ?? '')}>Run</button>
    </div>
  </header>

  <div class="playground-main">
    <div class="playground-editor" bind:this={editorContainer}></div>
    <div class="playground-preview">
      {#if error}
        <div class="playground-error"><strong>Error</strong><pre>{error}</pre></div>
      {:else if pdfUrl}
        <iframe src={pdfUrl} title="PDF Preview" class="playground-iframe"></iframe>
      {:else}
        <div class="playground-placeholder">Write code to generate a PDF</div>
      {/if}
    </div>
  </div>
</div>

<style>
  .playground { display: flex; flex-direction: column; height: 100vh; background: #0f172a; color: #e2e8f0; }
  .playground-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; border-bottom: 1px solid #1e293b; background: #1e293b; }
  .playground-logo { display: flex; align-items: center; gap: 10px; }
  .playground-logo h1 { font-size: 16px; font-weight: 700; color: #f8fafc; margin: 0; }
  .playground-tag { font-size: 10px; font-weight: 600; color: #34d399; background: #064e3b; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
  .playground-actions { display: flex; align-items: center; gap: 10px; }
  .playground-status { font-size: 12px; color: #94a3b8; }
  .playground-btn { padding: 6px 16px; font-size: 13px; font-weight: 600; color: #fff; background: #10b981; border: none; border-radius: 6px; cursor: pointer; }
  .playground-btn:hover { background: #059669; }
  .playground-main { display: flex; flex: 1; overflow: hidden; }
  .playground-editor { flex: 1; overflow: hidden; }
  .playground-preview { flex: 1; background: #f1f5f9; display: flex; flex-direction: column; }
  .playground-iframe { flex: 1; border: none; width: 100%; height: 100%; }
  .playground-error { padding: 16px; color: #dc2626; background: #fef2f2; font-family: monospace; overflow: auto; flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .playground-error pre { margin: 0; white-space: pre-wrap; font-size: 12px; }
  .playground-placeholder { flex: 1; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 14px; }
</style>
