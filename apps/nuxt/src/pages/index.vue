<template>
    <div>
        d3swwwww
        <PDFViewer :style="{ flex: 1,width: '80%', height:'100%',position: 'absolute', left: '10%' }">
            <Pdf/>
        </PDFViewer>
    </div>
</template>
<script setup lang="ts">
import { onMounted, defineOptions, watchEffect} from 'vue'
import axios from 'axios'
import { useAsyncState } from '@vueuse/core'
import Pdf from '../components/pdf.vue'
import { renderVuePdf,toBlob } from '../utils/render'
import {pdf, } from '@pdf.js/vue'
import PDFViewer from '@pdf.js/vue/PDFViewer.vue'
defineOptions({
    components:{
        PDFViewer
    }
})

watchEffect(()=>{
    console.log("aazdw");
})

onMounted(async () => {
    const d = await pdf(Pdf)
    const blob = await d.toBlob();
    const url = URL.createObjectURL(blob);
    console.log("aqui blob", url); 
})

</script>