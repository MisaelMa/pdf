import { describe, it, expect } from 'vitest'
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
  renderToBuffer,
} from '../src'
import { resolveStyle } from '../src/stylesheet'
import { resolvePageSize } from '../src/page-sizes'

describe('Node creation', () => {
  it('creates a Document node', () => {
    const doc = Document({ title: 'Test' }, [])
    expect(doc.type).toBe('DOCUMENT')
    expect(doc.props.title).toBe('Test')
    expect(doc.children).toEqual([])
  })

  it('creates a Page node with defaults', () => {
    const page = Page()
    expect(page.type).toBe('PAGE')
    expect(page.children).toEqual([])
  })

  it('creates nested tree', () => {
    const doc = Document({}, [
      Page({ size: 'A4' }, [
        View({}, [
          Text({}, 'Hello'),
          Text({}, 'World'),
        ]),
      ]),
    ])
    expect(doc.children).toHaveLength(1)
    const page = doc.children[0]
    expect(typeof page).toBe('object')
    if (typeof page === 'string') return
    expect(page.type).toBe('PAGE')
    expect(page.children).toHaveLength(1)
  })

  it('Text accepts string children', () => {
    const t = Text({ style: { fontSize: 20 } }, 'hello')
    expect(t.children).toEqual(['hello'])
  })

  it('Text accepts array children', () => {
    const t = Text({}, ['hello', ' ', 'world'])
    expect(t.children).toEqual(['hello', ' ', 'world'])
  })

  it('Image creates a node with no children', () => {
    const img = Image({ src: '/test.png' })
    expect(img.type).toBe('IMAGE')
    expect(img.children).toEqual([])
    expect(img.props.src).toBe('/test.png')
  })

  it('Link wraps children', () => {
    const link = Link({ src: 'https://example.com' }, [
      Text({}, 'click me'),
    ])
    expect(link.type).toBe('LINK')
    expect(link.children).toHaveLength(1)
  })
})

describe('StyleSheet', () => {
  it('creates styles passthrough', () => {
    const styles = StyleSheet.create({
      page: { padding: 40 },
      title: { fontSize: 24, color: '#333' },
    })
    expect(styles.page.padding).toBe(40)
    expect(styles.title.fontSize).toBe(24)
  })
})

describe('resolveStyle', () => {
  it('returns defaults when no style provided', () => {
    const s = resolveStyle()
    expect(s.fontSize).toBe(12)
    expect(s.fontFamily).toBe('Helvetica')
    expect(s.color).toBe('#000000')
    expect(s.marginTop).toBe(0)
    expect(s.paddingTop).toBe(0)
  })

  it('expands shorthand margin', () => {
    const s = resolveStyle({ margin: 10 })
    expect(s.marginTop).toBe(10)
    expect(s.marginRight).toBe(10)
    expect(s.marginBottom).toBe(10)
    expect(s.marginLeft).toBe(10)
  })

  it('expands directional margin overrides shorthand', () => {
    const s = resolveStyle({ margin: 10, marginTop: 20 })
    expect(s.marginTop).toBe(20)
    expect(s.marginRight).toBe(10)
  })

  it('merges style arrays', () => {
    const s = resolveStyle([
      { fontSize: 20, color: 'red' },
      { color: 'blue' },
    ])
    expect(s.fontSize).toBe(20)
    expect(s.color).toBe('blue')
  })

  it('handles undefined/null in style arrays', () => {
    const s = resolveStyle([
      { fontSize: 20 },
      undefined as any,
      { color: 'red' },
    ])
    expect(s.fontSize).toBe(20)
    expect(s.color).toBe('red')
  })
})

describe('resolvePageSize', () => {
  it('resolves A4', () => {
    const size = resolvePageSize('A4')
    expect(size.width).toBeCloseTo(595.28)
    expect(size.height).toBeCloseTo(841.89)
  })

  it('resolves LETTER', () => {
    const size = resolvePageSize('LETTER')
    expect(size.width).toBe(612)
    expect(size.height).toBe(792)
  })

  it('handles landscape orientation', () => {
    const size = resolvePageSize('A4', 'landscape')
    expect(size.width).toBeGreaterThan(size.height)
  })

  it('resolves tuple size', () => {
    const size = resolvePageSize([500, 700])
    expect(size.width).toBe(500)
    expect(size.height).toBe(700)
  })

  it('resolves object size', () => {
    const size = resolvePageSize({ width: 500, height: 700 })
    expect(size.width).toBe(500)
    expect(size.height).toBe(700)
  })

  it('throws on unknown string size', () => {
    expect(() => resolvePageSize('UNKNOWN' as any)).toThrow()
  })
})

describe('Font', () => {
  it('registers and retrieves fonts', () => {
    Font.clear()
    Font.register({ family: 'TestFont', src: '/test.ttf' })
    const registered = Font.getRegistered()
    expect(registered.has('TestFont')).toBe(true)
    Font.clear()
  })
})

describe('Font advanced', () => {
  it('Font.load resolves without errors when no URL fonts registered', async () => {
    Font.clear()
    Font.register({ family: 'LocalFont', src: '/path/to/font.ttf' })
    await Font.load()
    const fonts = Font.getRegistered()
    expect(fonts.get('LocalFont')?.[0].loaded).toBe(true)
    Font.clear()
  })
})

describe('renderToBuffer', () => {
  it('generates valid PDF bytes', async () => {
    const doc = Document({ title: 'Test PDF' }, [
      Page({ size: 'A4' }, [
        Text({}, 'Hello World'),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer).toBeInstanceOf(Uint8Array)
    expect(buffer.length).toBeGreaterThan(100)

    const header = new TextDecoder().decode(buffer.slice(0, 5))
    expect(header).toBe('%PDF-')
  })

  it('renders styled text', async () => {
    const doc = Document({}, [
      Page({ size: 'A4', style: { padding: 40 } }, [
        Text(
          { style: { fontSize: 28, fontWeight: 'bold', color: '#1a1a2e' } },
          'Styled Title',
        ),
        Text(
          { style: { fontSize: 12, lineHeight: 1.5, color: '#333' } },
          'Body text with line height.',
        ),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('renders Views with background and border', async () => {
    const doc = Document({}, [
      Page({}, [
        View(
          {
            style: {
              padding: 20,
              backgroundColor: '#f0f0f0',
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 4,
            },
          },
          [Text({}, 'Inside a styled view')],
        ),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('renders multiple pages', async () => {
    const doc = Document({}, [
      Page({}, [Text({}, 'Page 1')]),
      Page({}, [Text({}, 'Page 2')]),
      Page({}, [Text({}, 'Page 3')]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(200)
  })

  it('renders landscape pages', async () => {
    const doc = Document({}, [
      Page({ size: 'A4', orientation: 'landscape' }, [
        Text({}, 'Landscape page'),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('handles empty document', async () => {
    const doc = Document({}, [Page({})])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(50)
  })

  it('handles document metadata', async () => {
    const doc = Document(
      { title: 'My Title', author: 'Me', subject: 'Testing', keywords: 'pdf,test' },
      [Page({}, [Text({}, 'test')])],
    )
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('renders nested Views', async () => {
    const doc = Document({}, [
      Page({ style: { padding: 20 } }, [
        View({ style: { padding: 10, backgroundColor: '#eee' } }, [
          View({ style: { padding: 5, backgroundColor: '#ddd' } }, [
            Text({}, 'Deeply nested'),
          ]),
        ]),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('renders gap between children', async () => {
    const doc = Document({}, [
      Page({}, [
        View({ style: { gap: 10 } }, [
          Text({}, 'Item 1'),
          Text({}, 'Item 2'),
          Text({}, 'Item 3'),
        ]),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('renders Link with text content', async () => {
    const doc = Document({}, [
      Page({ style: { padding: 40 } }, [
        Link({ src: 'https://example.com' }, [
          Text({}, 'Click here'),
        ]),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('renders Link wrapping a View', async () => {
    const doc = Document({}, [
      Page({ style: { padding: 40 } }, [
        Link({ src: 'https://example.com' }, [
          View({ style: { padding: 10, backgroundColor: '#e0e7ff' } }, [
            Text({}, 'Card link'),
          ]),
        ]),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('renders text transforms', async () => {
    const doc = Document({}, [
      Page({}, [
        Text({ style: { textTransform: 'uppercase' } }, 'hello'),
        Text({ style: { textTransform: 'lowercase' } }, 'HELLO'),
        Text({ style: { textTransform: 'capitalize' } }, 'hello world'),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('renders text decorations', async () => {
    const doc = Document({}, [
      Page({}, [
        Text({ style: { textDecoration: 'underline' } }, 'underlined'),
        Text({ style: { textDecoration: 'line-through' } }, 'strikethrough'),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('renders dashed and dotted borders', async () => {
    const doc = Document({}, [
      Page({ style: { padding: 20 } }, [
        View({ style: { borderWidth: 1, borderStyle: 'dashed', borderColor: '#999', padding: 10 } }, [
          Text({}, 'Dashed border'),
        ]),
        View({ style: { borderWidth: 1, borderStyle: 'dotted', borderColor: '#999', padding: 10, marginTop: 10 } }, [
          Text({}, 'Dotted border'),
        ]),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('handles Image node with empty src gracefully', async () => {
    const doc = Document({}, [
      Page({}, [
        Image({ src: '' }),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(50)
  })

  it('renders flexbox row layout', async () => {
    const doc = Document({}, [
      Page({ style: { padding: 20 } }, [
        View({ style: { flexDirection: 'row', gap: 10 } }, [
          View({ style: { flex: 1, backgroundColor: '#e0e7ff', padding: 10 } }, [
            Text({}, 'Column 1'),
          ]),
          View({ style: { flex: 1, backgroundColor: '#dbeafe', padding: 10 } }, [
            Text({}, 'Column 2'),
          ]),
          View({ style: { flex: 1, backgroundColor: '#e0f2fe', padding: 10 } }, [
            Text({}, 'Column 3'),
          ]),
        ]),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('renders flexbox with justifyContent center', async () => {
    const doc = Document({}, [
      Page({ style: { padding: 20 } }, [
        View({ style: { flexDirection: 'row', justifyContent: 'center', height: 100 } }, [
          View({ style: { width: 50, height: 50, backgroundColor: '#f87171' } }, []),
          View({ style: { width: 50, height: 50, backgroundColor: '#60a5fa' } }, []),
        ]),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('renders flexbox with alignItems center', async () => {
    const doc = Document({}, [
      Page({ style: { padding: 20 } }, [
        View({ style: { flexDirection: 'row', alignItems: 'center', height: 100, backgroundColor: '#f5f5f5' } }, [
          Text({ style: { fontSize: 20 } }, 'Big'),
          Text({ style: { fontSize: 10 } }, 'Small'),
        ]),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('renders flexGrow distribution', async () => {
    const doc = Document({}, [
      Page({ style: { padding: 20 } }, [
        View({ style: { flexDirection: 'row' } }, [
          View({ style: { flexGrow: 1, backgroundColor: '#a5b4fc', padding: 10 } }, [
            Text({}, 'Grow 1'),
          ]),
          View({ style: { flexGrow: 2, backgroundColor: '#818cf8', padding: 10 } }, [
            Text({}, 'Grow 2'),
          ]),
        ]),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('renders absolute positioning', async () => {
    const doc = Document({}, [
      Page({ style: { padding: 20 } }, [
        View({ style: { height: 200 } }, [
          View({
            style: {
              position: 'absolute',
              top: 10,
              right: 10,
              width: 80,
              height: 80,
              backgroundColor: '#fbbf24',
            },
          }, [
            Text({}, 'Abs'),
          ]),
          Text({}, 'Normal flow'),
        ]),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('renders space-between layout', async () => {
    const doc = Document({}, [
      Page({ style: { padding: 20 } }, [
        View({
          style: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            backgroundColor: '#f1f5f9',
          },
        }, [
          Text({}, 'Left'),
          Text({}, 'Right'),
        ]),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('renders page wrapping with overflowing content', async () => {
    const items = Array.from({ length: 50 }, (_, i) =>
      Text({ style: { fontSize: 12, marginBottom: 5 } }, `Item ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`),
    )
    const doc = Document({}, [
      Page({ size: 'A4', style: { padding: 40 } }, items),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(500)
  })

  it('respects wrap=false on page', async () => {
    const items = Array.from({ length: 30 }, (_, i) =>
      Text({}, `Line ${i + 1}`),
    )
    const doc = Document({}, [
      Page({ size: 'A4', wrap: false, style: { padding: 20 } }, items),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(100)
  })

  it('renders complex multi-section document', async () => {
    const styles = StyleSheet.create({
      page: { padding: 40, backgroundColor: '#ffffff' },
      header: { fontSize: 28, fontWeight: 'bold', color: '#1a1a2e', textAlign: 'center', marginBottom: 10 },
      section: { marginBottom: 15, padding: 15, backgroundColor: '#f0f4f8', borderRadius: 4, borderWidth: 1, borderColor: '#d1d5db' },
      sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#2d3748', marginBottom: 6 },
      text: { fontSize: 11, color: '#4a5568', lineHeight: 1.6 },
    })

    const doc = Document({ title: 'Complex Doc', author: 'Test' }, [
      Page({ size: 'A4', style: styles.page }, [
        Text({ style: styles.header }, 'Complex Document'),
        View({ style: styles.section }, [
          Text({ style: styles.sectionTitle }, 'Section 1'),
          Text({ style: styles.text }, 'Body text for section 1 with multiple lines of content that should wrap properly within the available width.'),
        ]),
        View({ style: styles.section }, [
          Text({ style: styles.sectionTitle }, 'Section 2'),
          Text({ style: styles.text }, 'Another section with different content.'),
        ]),
      ]),
      Page({ size: 'LETTER', orientation: 'landscape' }, [
        Text({}, 'Page 2 in landscape'),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(500)
  })

  it('renders views with borderRadius (rounded rectangles)', async () => {
    const doc = Document({ title: 'Rounded' }, [
      Page({ size: 'A4', style: { padding: 30 } }, [
        View({ style: { backgroundColor: '#3b82f6', borderRadius: 12, padding: 16 } }, [
          Text({ style: { color: '#ffffff', fontSize: 14 } }, 'Rounded card'),
        ]),
        View({ style: { borderWidth: 2, borderColor: '#ef4444', borderRadius: 8, padding: 10, marginTop: 10 } }, [
          Text({}, 'Rounded border only'),
        ]),
        View({ style: { backgroundColor: '#10b981', borderWidth: 1, borderColor: '#065f46', borderRadius: 20, padding: 12, marginTop: 10 } }, [
          Text({ style: { color: '#ffffff' } }, 'Fill + stroke rounded'),
        ]),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(500)
  })
})

describe('Table components', () => {
  it('creates Table node as VIEW with column direction', () => {
    const table = Table({}, [])
    expect(table.type).toBe('VIEW')
    expect(table.props.style.flexDirection).toBe('column')
  })

  it('creates TableRow node as VIEW with row direction', () => {
    const row = TableRow({}, [])
    expect(row.type).toBe('VIEW')
    expect(row.props.style.flexDirection).toBe('row')
  })

  it('creates TableCell node as VIEW with flex and default styles', () => {
    const cell = TableCell({}, 'Hello')
    expect(cell.type).toBe('VIEW')
    expect(cell.props.style.flex).toBe(1)
    expect(cell.props.style.padding).toBe(6)
    expect(cell.props.style.borderWidth).toBe(0.5)
  })

  it('supports colSpan in TableCell', () => {
    const cell = TableCell({ colSpan: 3 }, 'Wide cell')
    expect(cell.props.style.flex).toBe(3)
  })

  it('renders a full table to PDF buffer', async () => {
    const doc = Document({ title: 'Table Test' }, [
      Page({ size: 'A4', style: { padding: 40 } }, [
        Text({ style: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' } }, 'Invoice'),
        Table({ style: { borderWidth: 1, borderColor: '#000000' } }, [
          TableRow({ style: { backgroundColor: '#374151' } }, [
            TableCell({}, [Text({ style: { color: '#ffffff', fontWeight: 'bold', fontSize: 10 } }, 'Item')]),
            TableCell({}, [Text({ style: { color: '#ffffff', fontWeight: 'bold', fontSize: 10 } }, 'Qty')]),
            TableCell({}, [Text({ style: { color: '#ffffff', fontWeight: 'bold', fontSize: 10 } }, 'Price')]),
          ]),
          TableRow({}, [
            TableCell({}, [Text({ style: { fontSize: 10 } }, 'Widget A')]),
            TableCell({}, [Text({ style: { fontSize: 10 } }, '5')]),
            TableCell({}, [Text({ style: { fontSize: 10 } }, '$25.00')]),
          ]),
          TableRow({ style: { backgroundColor: '#f3f4f6' } }, [
            TableCell({}, [Text({ style: { fontSize: 10 } }, 'Widget B')]),
            TableCell({}, [Text({ style: { fontSize: 10 } }, '10')]),
            TableCell({}, [Text({ style: { fontSize: 10 } }, '$50.00')]),
          ]),
          TableRow({}, [
            TableCell({ colSpan: 2 }, [Text({ style: { fontSize: 10, fontWeight: 'bold' } }, 'Total')]),
            TableCell({}, [Text({ style: { fontSize: 10, fontWeight: 'bold' } }, '$75.00')]),
          ]),
        ]),
      ]),
    ])
    const buffer = await renderToBuffer(doc)
    expect(buffer.length).toBeGreaterThan(500)
  })
})
