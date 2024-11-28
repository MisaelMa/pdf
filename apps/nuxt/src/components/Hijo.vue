<script>
import { ref, reactive, watchEffect, createApp } from 'vue'
import { createRenderer} from '@pdf.js/vue/src/renderer'
import { on } from 'events';
export default {
  setup(props, { slots }) {
    const slotData = ref(null)
    const updateKey = ref(0) // Clave reactiva para forzar la actualización
    const refSlot =  reactive({render: null})
     
    watchEffect(async ()=>{
        const vnode = slots.default()
        const r = await createRenderer(vnode[0])
        refSlot.render  = r.render
        refSlot.rende && createApp(refSlot.render,{}).mount('#pdf', true).$forceUpdate()
  
    })

    // Forzamos la actualización cuando se monta el componente
  //  updateKey.value++

 return {
      refSlot,
      slotData,
      updateKey
    }
  }
}
</script>
<template setup>
    amir
    <div id="pdf"></div>

    {{ refSlot.render }}
</template>
