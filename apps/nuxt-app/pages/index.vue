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

const title = ref('PDFCraft Nuxt Demo')
const mode = ref<'declarative' | 'ssr'>('declarative')

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
  <div
    style="
      display: flex;
      flex-direction: column;
      height: 100vh;
      padding: 16px;
      gap: 12px;
      font-family: system-ui, sans-serif;
    "
  >
    <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap">
      <h2 style="white-space: nowrap; margin: 0">Nuxt Demo</h2>
      <input
        v-model="title"
        placeholder="PDF Title"
        style="
          flex: 1;
          min-width: 200px;
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
        "
      />
      <select
        v-model="mode"
        style="padding: 8px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px"
      >
        <option value="declarative">Client — Declarative</option>
        <option value="ssr">Server — /api/pdf</option>
      </select>
    </div>

    <!-- Declarative (client-side) -->
    <ClientOnly v-if="mode === 'declarative'">
      <PDFViewer width="100%" style="flex: 1; border-radius: 8px; overflow: hidden">
        <PDFDocument :title="title" author="PDFCraft">
          <PDFPage size="A4" :style="styles.page">
            <PDFText :style="styles.header">{{ title }}</PDFText>
            <PDFText :style="styles.subtitle">
              Generated client-side with declarative components
            </PDFText>
            <PDFView :style="styles.section">
              <PDFText :style="styles.sectionTitle">Declarative API</PDFText>
              <PDFText :style="styles.text">
                This PDF is built using Vue template components. Change the title
                above and watch it re-render reactively.
              </PDFText>
            </PDFView>
          </PDFPage>
        </PDFDocument>
      </PDFViewer>
    </ClientOnly>

    <!-- SSR (server-side) -->
    <iframe
      v-if="mode === 'ssr'"
      src="/api/pdf"
      title="Server-rendered PDF"
      style="flex: 1; border: none; border-radius: 8px"
    />
  </div>
</template>
