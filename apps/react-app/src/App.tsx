import { useState } from 'react'
import {
  PDFViewer,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from '@pdfcraft/react'

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#ffffff' },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f0f4f8',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 6,
  },
  text: { fontSize: 11, color: '#4a5568', lineHeight: 1.6 },
})

export default function App() {
  const [title, setTitle] = useState('PDFCraft React Demo')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: 16,
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h2 style={{ whiteSpace: 'nowrap', margin: 0 }}>React Demo</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="PDF Title"
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: 6,
            fontSize: 14,
          }}
        />
      </div>

      <PDFViewer
        width="100%"
        height="100%"
        style={{ flex: 1, borderRadius: 8, overflow: 'hidden' }}
      >
        <Document title={title} author="PDFCraft">
          <Page size="A4" style={styles.page}>
            <Text style={styles.header}>{title}</Text>
            <Text style={styles.subtitle}>
              Generated with declarative React components
            </Text>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>JSX Components</Text>
              <Text style={styles.text}>
                Just like react-pdf — nest Document, Page, View, Text inside a
                PDFViewer. Change the title above and watch it re-render.
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Styled components</Text>
              <Text style={styles.text}>
                Views with backgrounds, borders and border-radius. Text with
                font sizes, weights, colors, and line heights.
              </Text>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  )
}
