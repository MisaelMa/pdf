import { useState, useCallback, useRef, useEffect, type CSSProperties } from 'react'
import Editor from '@monaco-editor/react'

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

      <Text style={styles.footer}>PDFCraft Playground — pdf-lib + yoga layout engine</Text>
    </Page>
  </Document>
)
`

export default function Playground() {
  const [pdfUrl, setPdfUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const urlRef = useRef('')
  const versionRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const codeRef = useRef(DEFAULT_CODE)

  const generatePDF = useCallback(async (source: string) => {
    const v = ++versionRef.current
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: source }),
      })
      if (v !== versionRef.current) return
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || `Server error: ${res.status}`)
        setLoading(false)
        return
      }
      const blob = await res.blob()
      if (v !== versionRef.current) return
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
      urlRef.current = URL.createObjectURL(blob)
      setPdfUrl(urlRef.current)
    } catch (err: any) {
      if (v !== versionRef.current) return
      setError(err?.message || String(err))
    } finally {
      if (v === versionRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    generatePDF(DEFAULT_CODE)
    return () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current) }
  }, [])

  const handleChange = useCallback((value: string | undefined) => {
    codeRef.current = value ?? ''
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => generatePDF(codeRef.current), 800)
  }, [generatePDF])

  return (
    <div style={wrapStyle}>
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', margin: 0 }}>PDFCraft</h1>
          <span style={tagStyle}>PLAYGROUND</span>
          <span style={{ fontSize: 10, color: '#64748b' }}>Server-rendered via /api/playground</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {loading && <span style={{ fontSize: 12, color: '#94a3b8' }}>Generating...</span>}
          <button style={btnStyle} onClick={() => generatePDF(codeRef.current)}>Run</button>
        </div>
      </header>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Editor defaultLanguage="typescriptreact" value={DEFAULT_CODE} onChange={handleChange} theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, wordWrap: 'on', tabSize: 2, padding: { top: 12 } }} />
        </div>
        <div style={{ flex: 1, background: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>
          {error ? (
            <div style={errorStyle}><strong>Error</strong><pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 12 }}>{error}</pre></div>
          ) : pdfUrl ? (
            <iframe src={pdfUrl} title="PDF Preview" style={{ flex: 1, border: 'none', width: '100%' }} />
          ) : (
            <div style={placeholderStyle}>Write code to generate a PDF</div>
          )}
        </div>
      </div>
    </div>
  )
}

const wrapStyle: CSSProperties = { display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f172a', color: '#e2e8f0' }
const headerStyle: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', borderBottom: '1px solid #1e293b', background: '#1e293b' }
const tagStyle: CSSProperties = { fontSize: 10, fontWeight: 600, color: '#f97316', background: '#431407', padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }
const btnStyle: CSSProperties = { padding: '6px 16px', fontSize: 13, fontWeight: 600, color: '#fff', background: '#f97316', border: 'none', borderRadius: 6, cursor: 'pointer' }
const errorStyle: CSSProperties = { padding: 16, color: '#dc2626', background: '#fef2f2', fontFamily: 'monospace', overflow: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }
const placeholderStyle: CSSProperties = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 14 }
