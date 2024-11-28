'use client'
import { Document, PDFViewer, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { useEffect, useState } from 'react'
import Quixote from './PDFSSR'
import PDFViewerWithNoSSR from './DocuPDF'
const PdfPage = () => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    <div>
      {isClient && (
        <PDFViewer>
         <Quixote/>
        </PDFViewer>
      )}

<PDFViewerWithNoSSR value={<Quixote />} /> 
    </div>
  )
}
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
})

export default PdfPage