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
} from '@pdf.js/vue'
import Playground from './Playground.vue'
import PDFCanvasViewer from './PDFCanvasViewer.vue'

const tab = ref<'demo' | 'canvas' | 'playground'>('demo')
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
  <!-- Tab bar -->
  <div class="tab-bar">
    <button
      :class="['tab', tab === 'demo' && 'tab-active']"
      @click="tab = 'demo'"
    >
      Demo
    </button>
    <button
      :class="['tab', tab === 'canvas' && 'tab-active']"
      @click="tab = 'canvas'"
    >
      Canvas Viewer
    </button>
    <button
      :class="['tab', tab === 'playground' && 'tab-active']"
      @click="tab = 'playground'"
    >
      Playground
    </button>
  </div>

  <!-- Demo view -->
  <div v-if="tab === 'demo'" class="demo">
    <div class="demo-toolbar">
      <h2 style="white-space: nowrap; margin: 0">Vue Demo</h2>
      <input
        v-model="title"
        placeholder="PDF Title"
        class="demo-input"
      />
    </div>

    <PDFViewer :deps="[title]" width="100%" style="flex: 1; border-radius: 8px; overflow: hidden">
      <PDFDocument :title="title" author="PDFCraft">
        <PDFPage size="A4" :style="styles.page">
          <PDFText :style="styles.header">{{ title }}</PDFText>
          <PDFText :style="styles.subtitle">
            Generated with declarative Vue components + Yoga flexbox layout
          </PDFText>

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
              <PDFText :style="styles.cardTitle">pdf-lib</PDFText>
              <PDFText :style="styles.cardText">
                Built on pdf-lib for high-quality PDF output with fonts, images, links, and forms.
              </PDFText>
            </PDFView>
          </PDFView>

          <PDFView :style="{ flexDirection: 'row', gap: 8, marginBottom: 12, alignItems: 'center' }">
            <PDFText :style="styles.badge">Vue</PDFText>
            <PDFText :style="styles.badge">React</PDFText>
            <PDFText :style="styles.badge">Svelte</PDFText>
            <PDFText :style="styles.badge">Nuxt SSR</PDFText>
            <PDFText :style="styles.badge">Next SSR</PDFText>
          </PDFView>

          <PDFView :style="styles.section">
            <PDFText :style="styles.sectionTitle">Styled components</PDFText>
            <PDFText :style="styles.text">
              Views with backgrounds, borders, border-radius, and opacity. Text with
              font sizes, weights, colors, line heights, letter spacing, and decorations.
            </PDFText>
          </PDFView>

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
            Built with @pdf.js/vue — pdf-lib + yoga layout engine
          </PDFText>
        </PDFPage>
      </PDFDocument>
    </PDFViewer>
  </div>

  <!-- Canvas viewer -->
  <PDFCanvasViewer v-if="tab === 'canvas'" />

  <!-- Playground view -->
  <Playground v-if="tab === 'playground'" />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
}

.tab-bar {
  display: flex;
  gap: 0;
  background: #1e293b;
  border-bottom: 1px solid #334155;
}

.tab {
  padding: 10px 24px;
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s;
}

.tab:hover {
  color: #e2e8f0;
  background: #334155;
}

.tab-active {
  color: #f8fafc;
  border-bottom-color: #10b981;
}

.demo {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px;
  gap: 12px;
  background: #ffffff;
  overflow: hidden;
  height: calc(100vh - 43px);
}

.demo-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.demo-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}
</style>
