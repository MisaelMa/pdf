import { useEventBus } from '../hook/useEventBus';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  ref,
  toRefs,
  useId,
  useSlots,
  watch,
  Teleport,
  onMounted,
  nextTick,
  inject,
  useTemplateRef,
  defineExpose,
} from 'vue';
import { fetch_node } from '../utils';

export const Text = defineComponent({
  name: 'Text',
  inheritAttrs: false,
  props: {
    style: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { on } = useEventBus('text-overflow');
    const { emit } = useEventBus('page-overflow');
    const { on: onTeleport } = useEventBus('text-teleport');
    const pageContentId = inject('pageContentId');
    const style = toRefs(props.style);
    const id = useId();
    const textRef = useTemplateRef(`text-${id}`)
    const slots = useSlots();

    const instance = getCurrentInstance();
    const teleport = ref({
      to: null,
    });

    const isOverflowing = ref(false);

    const checkOverflow = () => {
      const element = instance?.vnode.el; // Nodo actual del componente
      if (element) {
        // Verificar si el contenido desborda
        isOverflowing.value =
          element.scrollHeight > element.clientHeight ||
          element.scrollWidth > element.clientWidth;

       
      }
    };
    on((eventName, payload) => {
      if (payload.textId === id) {
        //teleport.value.to = payload.to;
        emit('page-overflow', { textId: id, emitPageId: pageContentId.id });
      }
    });
   
    onTeleport((eventName, payload) => {
      if (payload.textId === id) {
        teleport.value.to = payload.to;
      }
    });
    // Verificar el desbordamiento después del montaje y en actualizaciones
    onMounted(() => {
      nextTick(checkOverflow);
      pageContentId.content.push({ id, textRef });
    });

    watch(
      () => slots.default?.(),
      () => nextTick(checkOverflow),
      { deep: true }
    );
    const runTeleport = () => {
      console.log('runTeleport');
    };

    defineExpose({
      runTeleport,
    });
    return () => {
      const content = h(
        'p',
        {
          id,
          ref: `text-${id}`,
          'data-name': 'text-p',
          style: {
            margin: '0px',
            ...props.style,
          },
        },
        slots.default?.()
      );

      if (isOverflowing.value) {
        console.log('Text is overflowing');
      }

       if (teleport.value.to) {
        return h(Teleport, { to: `#${teleport.value.to}` }, content);
      } 

      return content;
    };
  },
});
