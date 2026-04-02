import * as PdfcraftReact from '@pdfcraft/react'
import React from 'react'

/**
 * Compile user code string into a React component.
 * Strips import statements and evaluates the remaining code.
 */
export function compileCode(code: string): React.ComponentType | null {
  try {
    const cleaned = code
      .replace(/^import\s+.*from\s+['"][^'"]+['"]\s*;?\s*$/gm, '')
      .replace(/^export\s+default\s+/gm, 'const __DefaultExport__ = ')

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
       ${cleaned}
       if (typeof __DefaultExport__ !== 'undefined') return __DefaultExport__;
       if (typeof MyDocument !== 'undefined') return MyDocument;
       return null;`,
    )

    const Component = fn(...paramValues)
    if (typeof Component === 'function') return Component
    return null
  } catch (err) {
    console.error('[REPL compile]', err)
    return null
  }
}
