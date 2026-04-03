<script lang="ts">
  import { onDestroy } from 'svelte'
  import {
    usePDF,
    Document,
    Page,
    View,
    Text,
    StyleSheet,
  } from '@pdf.js/svelte'
  import Playground from './Playground.svelte'

  const styles = StyleSheet.create({
    page: { padding: 40, backgroundColor: '#ffffff' },
    header: { fontSize: 28, fontWeight: 'bold' as const, color: '#1a1a2e', textAlign: 'center' as const, marginBottom: 10 },
    subtitle: { fontSize: 12, fontStyle: 'italic' as const, color: '#888', textAlign: 'center' as const, marginBottom: 30 },
    section: { marginBottom: 15, padding: 15, backgroundColor: '#f0f4f8', borderRadius: 4, borderWidth: 1, borderColor: '#d1d5db' },
    sectionTitle: { fontSize: 14, fontWeight: 'bold' as const, color: '#2d3748', marginBottom: 6 },
    text: { fontSize: 11, color: '#4a5568', lineHeight: 1.6 },
  })

  let tab = $state<'demo' | 'playground'>('demo')
  let title = $state('PDFCraft Svelte Demo')

  const { url, loading, destroy } = usePDF(() =>
    Document({ title, author: 'PDFCraft' }, [
      Page({ size: 'A4', style: styles.page }, [
        Text({ style: styles.header }, title),
        Text({ style: styles.subtitle }, 'Generated with @pdf.js/svelte'),
        View({ style: styles.section }, [
          Text({ style: styles.sectionTitle }, 'Store-based API'),
          Text({ style: styles.text }, 'The usePDF function returns Svelte stores. Subscribe with $ auto-syntax for reactive updates.'),
        ]),
        View({ style: styles.section }, [
          Text({ style: styles.sectionTitle }, 'Styled components'),
          Text({ style: styles.text }, 'This PDF uses Views with backgrounds, borders and border-radius, Text with font sizes, weights, colors, and line heights.'),
        ]),
      ]),
    ]),
  )

  onDestroy(destroy)
</script>

<div style="display: flex; flex-direction: column; height: 100vh; font-family: system-ui, sans-serif; background: #f8f9fa">
  <div class="tab-bar">
    <button class="tab" class:tab-active={tab === 'demo'} onclick={() => tab = 'demo'}>Demo</button>
    <button class="tab" class:tab-active={tab === 'playground'} onclick={() => tab = 'playground'}>Playground</button>
  </div>

  {#if tab === 'demo'}
    <div style="display: flex; flex-direction: column; flex: 1; padding: 16px; gap: 12px">
      <div style="display: flex; align-items: center; gap: 12px">
        <h2 style="white-space: nowrap">Svelte Demo</h2>
        <input bind:value={title} placeholder="PDF Title"
          style="flex: 1; padding: 8px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px" />
      </div>

      {#if $loading}
        <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 8px; color: #666">
          Generating PDF…
        </div>
      {:else if $url}
        <iframe src={$url} title="PDF Viewer" style="flex: 1; border: none; border-radius: 8px" />
      {:else}
        <div style="flex: 1; display: flex; align-items: center; justify-content: center; background: #fafafa; border-radius: 8px; border: 1px dashed #ddd; color: #999">
          No PDF document
        </div>
      {/if}
    </div>
  {:else}
    <Playground />
  {/if}
</div>

<style>
  .tab-bar { display: flex; gap: 0; border-bottom: 1px solid #e5e7eb; background: #f8f9fa; padding: 0 16px; }
  .tab { padding: 10px 20px; border: none; background: transparent; font-size: 14px; font-weight: 600; color: #6b7280; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.15s; }
  .tab-active { color: #2563eb; border-bottom-color: #2563eb; }
</style>
