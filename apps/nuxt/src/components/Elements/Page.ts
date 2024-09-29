import type { Slots } from "vue";
import { fetch_node } from "../../utils";
export const Page = defineComponent({
    name: "Page",
    setup(_props) {
      const id = useId();
      const slots = useSlots(); 
      const context = getCurrentInstance();
  
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
  
      return () =>
        h(
          "div",
          {
            id,
            "data-name": "page",
            style: { backgroundColor: "red" },
          },
          slots.default?.()
        );
    },
  });