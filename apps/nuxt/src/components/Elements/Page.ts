import type { Slots } from "vue";
import { defineProps } from "vue";
import { fetch_node } from "../../utils";
export const Page = defineComponent({
    name: "Page",
    props:{
      style: {
        type: Object,
        required: false,
        default: () => ({}),
      },
    },
    setup(props) {
      const id = useId();
      const slots = useSlots(); 
      const context = getCurrentInstance();
      /* const props = defineProps({
        style: {
          type: Object,
          required: false,
          default: () => ({}),
        },
      }); */
      const update = () => {
        console.log("UPDATE Page: Reactivity detected in slot content", context?.vnode?.el?.id);
        console.log("UPDATE Page: Slot content", memorizedSlot.value);
      };
      
      const memorizedSlot = computed(() => {
        return fetch_node(context?.slots as Slots)
      });
  
      
      watch(memorizedSlot, () => {
        update(); // Llamado cuando `memorizedSlot` cambia
      });
      console.log("Page aqui",  props);
  
      return () =>
        h(
          "div",
          {
            id,
            "data-name": "page",
            style: { 
              backgroundColor: "white",
              height: "1065px",
              ...props.style,
            },
          },
          slots.default?.()
        );
    },
  });