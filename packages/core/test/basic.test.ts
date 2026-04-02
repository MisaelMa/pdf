import { describe, it, expect } from 'vitest'
import {
  Document,
  Page,
  View,
  Text,
  Image,
  Link,
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
})
