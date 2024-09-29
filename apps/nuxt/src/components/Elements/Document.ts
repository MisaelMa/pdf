import type { Slots } from "vue";
import { fetch_node } from "../../utils";
export const Document = defineComponent({
    name: "Document",
    setup(_props) {
      const width = "795px";
      const height = "1065px";
      const id = useId();
      const slots = useSlots();
      const context = getCurrentInstance();

      const memorizedSlot = computed(() => {
        return fetch_node(context?.slots as Slots)
      });
  
      const update = () => {
        console.log("UPDATE Document: Reactivity detected in slot content", context?.vnode?.el?.id);
        console.log("UPDATE Document: Slot content", memorizedSlot.value);
      };
      watch(memorizedSlot, () => {
        update(); // Llamado cuando `memorizedSlot` cambia
      });

      /* const pages = node[0].children.map((pageSlot: VNode) => {
        console.log(pageSlot);
        pageSlot.props = {
          ...pageSlot.props,
          style: {
            ...pageSlot.props?.style,
            height,
            maxHeight: height,
            backgroundColor: "#FFFFFF",
          },
        };
        return pageSlot;
      }); */
  
      return () =>
        h(
          "div",
          {
            id,
            "data-name": "DOCUMENT",
            style: {
              width: "100%",
              height: height,
              overflow: "hidden",
              overflowY: "auto",
              display: "grid",
              gap: "20px",
            },
          },
          slots.default?.()
        );
    },
  });
  
  