import { transform } from 'sucrase'
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
} from '@pdf.js/core'

const CORE_TYPES = new Set([Document, Page, View, Text, Image, Link, Table, TableRow, TableCell])

function createElement(type: any, props: any, ...children: any[]) {
  const flat = children.flat(Infinity).filter((c: any) => c != null && c !== true && c !== false)
  if (CORE_TYPES.has(type)) {
    const childArg = flat.length === 1 && typeof flat[0] === 'string' ? flat[0] : flat
    return type(props || {}, childArg)
  }
  if (typeof type === 'function') {
    return type({ ...(props || {}), children: flat })
  }
  return null
}

const ReactShim = { createElement, Fragment: ({ children }: any) => children }

export async function POST(request: Request) {
  try {
    const { code } = await request.json()
    if (!code || typeof code !== 'string') {
      return Response.json({ error: 'No code provided' }, { status: 400 })
    }

    const { code: transpiled } = transform(code, {
      transforms: ['typescript', 'jsx'],
      jsxRuntime: 'classic',
      production: true,
    })

    const scope = { React: ReactShim, Document, Page, View, Text, Image, Link, Table, TableRow, TableCell, StyleSheet, Font }
    const fn = new Function(...Object.keys(scope), `"use strict";\n${transpiled}`)
    const tree = fn(...Object.values(scope))

    if (!tree || typeof tree !== 'object' || tree.type !== 'DOCUMENT') {
      return Response.json({ error: 'Code must return a <Document> or Document() node.' }, { status: 400 })
    }

    const buffer = await renderToBuffer(tree)

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="playground.pdf"',
      },
    })
  } catch (err: any) {
    return Response.json({ error: err?.message || String(err) }, { status: 400 })
  }
}
