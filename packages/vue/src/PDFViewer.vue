<template>
<div>
  <!-- <div style="display:none">
<slot />
  </div> -->
  <iframe
    :src="src"
    :title="title"
    :ref="innerRef"
    :style="style"
    :class="className"
    v-bind="$attrs"
  />
</div>
</template>

<script >
import { ref, watch, onMounted, computed, watchEffect } from 'vue';
import usePDF from './usePDF';

export default {
  props: {
    title: String,
    style: Object,
    className: String,
    children: String,
    innerRef: String,
    showToolbar: {
      type: Boolean,
      default: true,
    },
  },
  setup(props,{ slots }) {
   
      const defaultSlotContent = slots.default?.();
      // Hacer lo que necesites con el contenido del slot "default"
      
    
 // Access the `this` context using `getCurrentInstance()`
    const { ctx } = getCurrentInstance();
    const innerRef = ref(props.innerRef);
    const { state:instance, update } = usePDF({ document: defaultSlotContent[0] });
    watch(()=>ctx.$el,()=>{
      console.log("actualizando s",slots.default());
      
    },{deep: true, immediate: true,flush:'pre',onTrack: (event) => {},onTrigger: (event) => {}})
    watchEffect(()=> {
      console.log("actualizando",ctx.$el);
      update()
    });

    const src = computed(()=>{
        return instance.url
      ? `${instance.url}#toolbar=${props.showToolbar ? 1 : 0}`
      : null; 
    })

    onMounted(() => {
      innerRef.value = document.querySelector(`[ref="${props.innerRef}"]`);
    console.log("mounted",ctx.$el.firstElementChild);
       const observer = new MutationObserver(()=>{
        console.log("actualizando");
        // update()
       });
      observer.observe(ctx.$el.firstElementChild, {
        childList: true,
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true,
        subtree: true,
        attributes: true
      });
      ctx.observer = observer; 
    });

    // Use onUnmounted to replace the `beforeUnmount` lifecycle hook
    onUnmounted(() => {
      ctx.observer.disconnect();
    });

    return {
      src,
      instance,
      innerRef,
    };
  },
};
</script>
