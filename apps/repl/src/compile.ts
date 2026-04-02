import { transform } from 'sucrase'
import * as PdfcraftReact from '@pdfcraft/react'
import React from 'react'

/**
 * Compile user JSX/TSX code into a React component.
 * 1. Strip import statements
 * 2. Transpile JSX → React.createElement via sucrase
 * 3. Evaluate with PDFCraft in scope
 */
export function compileCode(code: string): { component: React.ComponentType | null; error: string | null } {
  try {
    let cleaned = code
      .replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"]\s*;?\s*$/gm, '')
      .replace(/^export\s+default\s+/gm, 'const __DefaultExport__ = ')

    const { code: transpiled } = transform(cleaned, {
      transforms: ['jsx', 'typescript'],
      jsxRuntime: 'classic',
      production: true,
    })

    const scope = {
      React,
      ...PdfcraftReact,
      Document: PdfcraftReact.Document,
      Page: PdfcraftReact.Page,
      View: PdfcraftReact.View,
      Text: PdfcraftReact.Text,
      Image: PdfcraftReact.Image,
      Link: PdfcraftReact.Link,
      StyleSheet: PdfcraftReact.StyleSheet,
      Font: PdfcraftReact.Font,
    }

    const paramNames = Object.keys(scope)
    const paramValues = Object.values(scope)

    const fn = new Function(
      ...paramNames,
      `"use strict";
       ${transpiled}
       if (typeof __DefaultExport__ !== 'undefined') return __DefaultExport__;
       if (typeof MyDocument !== 'undefined') return MyDocument;
       return null;`,
    )

    const Component = fn(...paramValues)
    if (typeof Component === 'function') return { component: Component, error: null }
    return { component: null, error: 'No default export found. Export a function component as default.' }
  } catch (err: any) {
    return { component: null, error: err?.message || String(err) }
  }
}
