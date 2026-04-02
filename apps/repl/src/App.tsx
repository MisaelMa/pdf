import { useState, useCallback, useRef, useEffect, type CSSProperties } from 'react'
import Editor from '@monaco-editor/react'
import { renderToBlob, buildPDFTree } from '@pdfcraft/react'
import { DEFAULT_CODE } from './default-code'
import { compileCode } from './compile'

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [pdfUrl, setPdfUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const urlRef = useRef('')
  const versionRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const generatePDF = useCallback(async (source: string) => {
    const v = ++versionRef.current
    setLoading(true)
    setError('')

    try {
      const { component: Component, error: compileError } = compileCode(source)
      if (compileError || !Component) {
        setError(compileError || 'No default export found. Export a component as default.')
        setLoading(false)
        return
      }

      const rendered = Component({})
      const tree = buildPDFTree(rendered)
      if (!tree) {
        setError('Could not build PDF tree. Make sure your component returns <Document>.')
        setLoading(false)
        return
      }

      const blob = await renderToBlob(tree)
      if (v !== versionRef.current) return

      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
      urlRef.current = URL.createObjectURL(blob)
      setPdfUrl(urlRef.current)
      setError('')
    } catch (err: any) {
      if (v !== versionRef.current) return
      setError(err?.message || String(err))
    } finally {
      if (v === versionRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    generatePDF(code)
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    }
  }, [])

  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      const newCode = value ?? ''
      setCode(newCode)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => generatePDF(newCode), 800)
    },
    [generatePDF],
  )

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={logoStyle}>PDFCraft</h1>
          <span style={tagStyle}>REPL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {loading && <span style={statusStyle}>Generating...</span>}
          <button style={btnStyle} onClick={() => generatePDF(code)}>
            Run
          </button>
        </div>
      </header>

      <div style={mainStyle}>
        <div style={editorPanelStyle}>
          <Editor
            defaultLanguage="typescript"
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              tabSize: 2,
              padding: { top: 12 },
            }}
          />
        </div>

        <div style={previewPanelStyle}>
          {error ? (
            <div style={errorStyle}>
              <strong>Error</strong>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 12 }}>
                {error}
              </pre>
            </div>
          ) : pdfUrl ? (
            <iframe src={pdfUrl} title="PDF Preview" style={iframeStyle} />
          ) : (
            <div style={placeholderStyle}>Write code to generate a PDF</div>
          )}
        </div>
      </div>
    </div>
  )
}

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: '#0f172a',
  color: '#e2e8f0',
}

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 16px',
  borderBottom: '1px solid #1e293b',
  backgroundColor: '#1e293b',
}

const logoStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: '#f8fafc',
}

const tagStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: '#818cf8',
  backgroundColor: '#312e81',
  padding: '2px 8px',
  borderRadius: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const statusStyle: CSSProperties = {
  fontSize: 12,
  color: '#94a3b8',
}

const btnStyle: CSSProperties = {
  padding: '6px 16px',
  fontSize: 13,
  fontWeight: 600,
  color: '#fff',
  backgroundColor: '#6366f1',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
}

const mainStyle: CSSProperties = {
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
}

const editorPanelStyle: CSSProperties = {
  flex: 1,
  overflow: 'hidden',
}

const previewPanelStyle: CSSProperties = {
  flex: 1,
  backgroundColor: '#f1f5f9',
  display: 'flex',
  flexDirection: 'column',
}

const iframeStyle: CSSProperties = {
  flex: 1,
  border: 'none',
  width: '100%',
  height: '100%',
}

const errorStyle: CSSProperties = {
  padding: 16,
  color: '#dc2626',
  backgroundColor: '#fef2f2',
  fontFamily: 'monospace',
  overflow: 'auto',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}

const placeholderStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#94a3b8',
  fontSize: 14,
}
