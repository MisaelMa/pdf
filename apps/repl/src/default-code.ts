export const DEFAULT_CODE = `import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
} from '@pdf.js/react'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  card: {
    flex: 1,
    padding: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 10,
    color: '#64748b',
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 14,
    padding: 14,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 4,
  },
  text: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.5,
  },
  badge: {
    backgroundColor: '#6366f1',
    color: '#ffffff',
    fontSize: 8,
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  footer: {
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 20,
  },
})

export default function MyDocument() {
  return (
    <Document title="PDFCraft REPL" author="PDFCraft">
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Hello PDFCraft!</Text>
        <Text style={styles.subtitle}>
          Edit this code on the left and see the PDF update live
        </Text>

        <View style={styles.row}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Flexbox Layout</Text>
            <Text style={styles.cardText}>
              Powered by Yoga engine — supports row, column, flex-grow, gap,
              alignItems, justifyContent and more.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Styled Text</Text>
            <Text style={styles.cardText}>
              Font sizes, weights, colors, line heights, text transforms,
              and decorations — all via a CSS-like API.
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
            Change the text, add more Views, adjust styles — the PDF
            regenerates automatically. Use the same API as react-pdf.
          </Text>
        </View>

        <Text style={styles.footer}>
          PDFCraft REPL — pdf-lib + yoga layout engine
        </Text>
      </Page>
    </Document>
  )
}
`
