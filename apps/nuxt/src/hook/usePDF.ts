import { ref } from 'vue'
const pdf  = ref({

})

const usePDF = () => {
    const trigger = (callback: Function) => {
        callback()
    }
    return {
        pdf
    }
}