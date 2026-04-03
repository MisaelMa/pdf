import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  renderToBuffer,
} from '@pdf.js/core'

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

export default defineEventHandler(async () => {
  const doc = Document({ title: 'Nuxt SSR PDF', author: 'PDFCraft' }, [
    Page({ size: 'A4', style: styles.page }, [
      Text({ style: styles.header }, 'PDFCraft — Nuxt SSR'),
      Text(
        { style: styles.subtitle },
        'This PDF was generated server-side in a Nuxt API route',
      ),
      View({ style: styles.section }, [
        Text({ style: styles.sectionTitle }, 'Server-side rendering'),
        Text(
          { style: styles.text },
          'The /api/pdf endpoint uses @pdf.js/core to generate a PDF ' +
            'entirely on the server. No browser polyfills needed.',
        ),
      ]),
      View({ style: styles.section }, [
        Text({ style: styles.sectionTitle }, 'How it works'),
        Text(
          { style: styles.text },
          '1. Nuxt receives the request\n' +
            '2. @pdf.js/core builds the node tree\n' +
            '3. pdf-lib renders it to a buffer\n' +
            '4. The buffer is returned as application/pdf',
        ),
      ]),
    ]),
  ])

  const buffer = await renderToBuffer(doc)

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="nuxt-demo.pdf"',
    },
  })
})
