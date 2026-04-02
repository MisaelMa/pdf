import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  renderToBuffer,
} from '@pdfcraft/core'

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

export async function GET() {
  const doc = Document({ title: 'Next.js SSR PDF', author: 'PDFCraft' }, [
    Page({ size: 'A4', style: styles.page }, [
      Text({ style: styles.header }, 'PDFCraft — Next.js SSR'),
      Text(
        { style: styles.subtitle },
        'This PDF was generated server-side in a Next.js Route Handler',
      ),
      View({ style: styles.section }, [
        Text({ style: styles.sectionTitle }, 'Server Components + API Routes'),
        Text(
          { style: styles.text },
          'Next.js App Router API routes run on the server where PDFKit works ' +
            'natively. No browser polyfills needed for SSR.',
        ),
      ]),
      View({ style: styles.section }, [
        Text({ style: styles.sectionTitle }, 'Framework agnostic core'),
        Text(
          { style: styles.text },
          '@pdfcraft/core works in any JS runtime: Node.js, Deno, Bun, ' +
            'Cloudflare Workers, or the browser with polyfills.',
        ),
      ]),
    ]),
  ])

  const buffer = await renderToBuffer(doc)

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="nextjs-demo.pdf"',
    },
  })
}
