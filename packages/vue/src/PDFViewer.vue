<template>
  <div>
    <div style="display: none">
      <slot />
    </div>
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

<script setup>
import {
  ref,
  watch,
  onMounted,
  computed,
  watchEffect,
  toRefs,
  useSlots,
} from 'vue';
import usePDF from './usePDF';

const props = defineProps({
  title: String,
  style: Object,
  className: String,
  children: String,
  innerRef: String,
  showToolbar: {
    type: Boolean,
    default: true,
  },
});
const slots = useSlots();
const slotElement = ref(slots.default?.({})[0]) // slots.default?.(););

/* // Hacer lo que necesites con el contenido del slot "default"
    
    // Access the `this` context using `getCurrentInstance()`
    const { ctx } = getCurrentInstance();
    const innerRef = ref(props.innerRef); */
const { state: instance, update, reference } = usePDF({
  document: slotElement.value
});

const { ctx } = getCurrentInstance();
    const innerRef = ref(props.innerRef);
    const observer = ref(null);

const src = computed(() => {
  return instance.url
    ? `${instance.url}#toolbar=${props.showToolbar ? 1 : 0}`
    : null;
});
console.log('reference', reference.value);

const updates = () => {
  console.log('UPDATE');
};

watch(()=> ctx.$el.children[0][0], (reference) => {
  console.log('slotElement', reference)
});
onMounted(async () => {
  
  if (slots && !!slots.default().length) {
    console.log('slotElement', slotElement.value);
    const d = await update(slotElement.value);
    console.log('d', ctx.$el.children[0]);
    observer.value = new MutationObserver(updates);
    observer.value.observe(ctx.$el.children[0][0], {
      childList: true,
      subtree: true,
    }); 
    /*  
    console.log('observer', slotElement.value[0]);
observer.value.observe(slotElement.value[0].el, {
  childList: true,
  subtree: true,
}); */
  }

 
});
</script>
