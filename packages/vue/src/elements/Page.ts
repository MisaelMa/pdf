import type { Slots } from "vue";
import { computed, defineComponent, defineProps, getCurrentInstance, h, useId, useSlots, watch } from "vue";
import { fetch_node } from "../utils";
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
            style: { 
              backgroundColor: "white",
              height: "950px", // Altura fija de la página
              overflow: "hidden", // Evitar desbordamientos
              ...props.style,
              fontSize: "17.5px",
              fontFamily: "Calibri, Arial, sans-serif",
              lineHeight: 1.15,
              boxSizing: "border-box",
           
            },
          },
          h(
            "div",
            {
              "data-name": "page-content",
              style: {
                padding: "20px", // Padding aplicado correctamente
              height: "100%",
              boxSizing: "border-box", // Asegura que el padding no afecte el tamaño
              overflow: "hidden", // No permite que el contenido se desborde
              display: "flex",
              flexDirection: "column", // Permite que el contenido se apile de forma vertical
              justifyContent: "flex-start"
              },
            },
            slots.default?.() // Renderiza el contenido del slot
          )
        );
    },
  });


