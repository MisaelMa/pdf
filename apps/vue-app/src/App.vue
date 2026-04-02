<script setup lang="ts">
import { ref } from 'vue'
import {
  PDFViewer,
  PDFDocument,
  PDFPage,
  PDFView,
  PDFText,
  PDFLink,
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
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    padding: 14,
    backgroundColor: '#f0f4f8',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 6,
  },
  cardText: { fontSize: 10, color: '#4a5568', lineHeight: 1.5 },
  section: {
    marginBottom: 12,
    padding: 14,
    backgroundColor: '#f0f4f8',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 6,
  },
  text: { fontSize: 10, color: '#4a5568', lineHeight: 1.5 },
  badge: {
    backgroundColor: '#818cf8',
    color: '#ffffff',
    fontSize: 9,
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  link: { fontSize: 10, color: '#2563eb' },
  footer: {
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
  },
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
            Generated with declarative Vue components + Yoga flexbox layout
          </PDFText>

          <!-- Flexbox row with 3 equal columns -->
          <PDFView :style="styles.row">
            <PDFView :style="styles.card">
              <PDFText :style="styles.cardTitle">Reactive</PDFText>
              <PDFText :style="styles.cardText">
                Change the title above and the PDF updates in real time via Vue reactivity.
              </PDFText>
            </PDFView>
            <PDFView :style="styles.card">
              <PDFText :style="styles.cardTitle">Flexbox</PDFText>
              <PDFText :style="styles.cardText">
                Full flexbox layout powered by Yoga engine — row, column, gap, flex-grow.
              </PDFText>
            </PDFView>
            <PDFView :style="styles.card">
              <PDFText :style="styles.cardTitle">PDFKit</PDFText>
              <PDFText :style="styles.cardText">
                Built on PDFKit for high-quality PDF output with fonts, images, and links.
              </PDFText>
            </PDFView>
          </PDFView>

          <!-- Row with badges -->
          <PDFView :style="{ flexDirection: 'row', gap: 8, marginBottom: 12, alignItems: 'center' }">
            <PDFText :style="styles.badge">Vue</PDFText>
            <PDFText :style="styles.badge">React</PDFText>
            <PDFText :style="styles.badge">Svelte</PDFText>
            <PDFText :style="styles.badge">Nuxt SSR</PDFText>
            <PDFText :style="styles.badge">Next SSR</PDFText>
          </PDFView>

          <!-- Full-width section -->
          <PDFView :style="styles.section">
            <PDFText :style="styles.sectionTitle">Styled components</PDFText>
            <PDFText :style="styles.text">
              Views with backgrounds, borders, border-radius, and opacity. Text with
              font sizes, weights, colors, line heights, letter spacing, and decorations.
            </PDFText>
          </PDFView>

          <!-- Links section -->
          <PDFView :style="styles.section">
            <PDFText :style="styles.sectionTitle">Links</PDFText>
            <PDFView :style="{ flexDirection: 'row', gap: 16 }">
              <PDFLink src="https://github.com" :style="styles.link">
                <PDFText :style="styles.link">GitHub</PDFText>
              </PDFLink>
              <PDFLink src="https://vuejs.org" :style="styles.link">
                <PDFText :style="styles.link">Vue.js</PDFText>
              </PDFLink>
              <PDFLink src="https://react-pdf.org" :style="styles.link">
                <PDFText :style="styles.link">react-pdf</PDFText>
              </PDFLink>
            </PDFView>
          </PDFView>

          <PDFText :style="styles.footer">
            Built with @pdfcraft/vue — pdfkit + yoga layout engine
          </PDFText>
        </PDFPage>
      </PDFDocument>
    </PDFViewer>
  </div>
</template>
