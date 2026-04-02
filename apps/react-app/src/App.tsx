import { useState } from 'react'
import {
  PDFViewer,
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
} from '@pdfcraft/react'

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#ffffff' },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row' as const,
    gap: 10,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    padding: 14,
    backgroundColor: '#f0f4f8',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 6,
  },
  cardText: { fontSize: 10, color: '#4a5568', lineHeight: 1.5 },
  section: {
    marginBottom: 12,
    padding: 14,
    backgroundColor: '#f0f4f8',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 6,
  },
  text: { fontSize: 10, color: '#4a5568', lineHeight: 1.5 },
  badge: {
    backgroundColor: '#818cf8',
    color: '#ffffff',
    fontSize: 9,
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  link: { fontSize: 10, color: '#2563eb' },
  footer: {
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
  },
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
              Generated with declarative React components + Yoga flexbox layout
            </Text>

            <View style={styles.row}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Reactive</Text>
                <Text style={styles.cardText}>
                  Change the title above and the PDF updates via React state.
                </Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Flexbox</Text>
                <Text style={styles.cardText}>
                  Full flexbox layout with Yoga — row, column, gap, flex-grow.
                </Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>PDFKit</Text>
                <Text style={styles.cardText}>
                  High-quality PDF output with fonts, images, and links.
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12, alignItems: 'center' }}>
              <Text style={styles.badge}>Vue</Text>
              <Text style={styles.badge}>React</Text>
              <Text style={styles.badge}>Svelte</Text>
              <Text style={styles.badge}>Nuxt SSR</Text>
              <Text style={styles.badge}>Next SSR</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Styled components</Text>
              <Text style={styles.text}>
                Views with backgrounds, borders, border-radius. Text with font sizes,
                weights, colors, line heights, and decorations.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Links</Text>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <Link src="https://github.com" style={styles.link}>
                  <Text style={styles.link}>GitHub</Text>
                </Link>
                <Link src="https://react.dev" style={styles.link}>
                  <Text style={styles.link}>React</Text>
                </Link>
                <Link src="https://react-pdf.org" style={styles.link}>
                  <Text style={styles.link}>react-pdf</Text>
                </Link>
              </View>
            </View>

            <Text style={styles.footer}>
              Built with @pdfcraft/react — pdfkit + yoga layout engine
            </Text>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  )
}
