import type { APIRoute } from 'astro'
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

export const GET: APIRoute = async () => {
  const doc = Document({ title: 'Astro PDF Demo', author: 'PDFCraft' }, [
    Page({ size: 'A4', style: styles.page }, [
      Text({ style: styles.header }, 'PDFCraft Astro Demo'),
      Text({ style: styles.subtitle }, 'Generated server-side with @pdfcraft/core'),
      View({ style: styles.section }, [
        Text({ style: styles.sectionTitle }, 'Server-side rendering'),
        Text(
          { style: styles.text },
          'This PDF is generated on the server using an Astro API route. ' +
          'No browser polyfills needed — PDFKit runs natively in Node.js.',
        ),
      ]),
      View({ style: styles.section }, [
        Text({ style: styles.sectionTitle }, 'Framework agnostic'),
        Text(
          { style: styles.text },
          'The @pdfcraft/core package works anywhere JavaScript runs: ' +
          'Node.js, Deno, Bun, Cloudflare Workers, or the browser with polyfills.',
        ),
      ]),
    ]),
  ])

  const buffer = await renderToBuffer(doc)

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="demo.pdf"',
    },
  })
}
