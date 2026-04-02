<script setup lang="ts">
import { ref } from 'vue'
import {
  PDFViewer,
  PDFDocument,
  PDFPage,
  PDFView,
  PDFText,
  StyleSheet,
} from '@pdfcraft/vue'

const title = ref('PDFCraft Vue Demo')

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
</script>

<template>
  <div style="display: flex; flex-direction: column; height: 100vh; padding: 16px; gap: 12px">
    <div style="display: flex; align-items: center; gap: 12px">
      <h2 style="white-space: nowrap; margin: 0">Vue Demo</h2>
      <input
        v-model="title"
        placeholder="PDF Title"
        style="flex: 1; padding: 8px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px"
      />
    </div>

    <PDFViewer :deps="[title]" width="100%" style="flex: 1; border-radius: 8px; overflow: hidden">
      <PDFDocument :title="title" author="PDFCraft">
        <PDFPage size="A4" :style="styles.page">
          <PDFText :style="styles.header">{{ title }}</PDFText>
          <PDFText :style="styles.subtitle">
            Generated with declarative Vue components
          </PDFText>
          <PDFView :style="styles.section">
            <PDFText :style="styles.sectionTitle">Reactive amir yahved alym
            </PDFText>
            <PDFText :style="styles.text">
              Change the title input and watch the PDF update. The PDFViewer
              processes its slot content into a core node tree automatically.
            </PDFText>
          </PDFView>
          <PDFView :style="styles.section">
            <PDFText :style="styles.sectionTitle">Styled components</PDFText>
            <PDFText :style="styles.text">
              Views with backgrounds, borders and border-radius. Text with
              font sizes, weights, colors, and line heights.
            </PDFText>
          </PDFView>
        </PDFPage>
      </PDFDocument>
    </PDFViewer>
  </div>
</template>
