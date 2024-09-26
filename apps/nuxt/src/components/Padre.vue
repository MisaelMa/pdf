<template>
    <div>
    <input v-model="title" type="text" />
    <br>  
    <child-component>
        <PDF :title="title" ref="pdf"/>
      </child-component>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import ChildComponent from './Hijo.vue'
  import PDF from './pdf.vue'
  const pdf = ref(null)
  const title = ref('~ Created with react-pdf ~')
  watch(() => title.value, async () => {
    console.log('PDF:', title.value)
  })
  </script>
  