import type { ComponentInternalInstance, Slots } from "vue";
import { fetch_node } from "../../utils";
import { useEventBus } from "~/hook/useEventBus"
import { generatePdfFromJson } from "~/utils/pdf-json";
import { usePDF } from "~/hook/usePDF";
export const Document = defineComponent({
    name: "Document",
    setup(_props) {
      const width = "795px";
      const height = "1056px";
      const id = useId();
      const slots = useSlots();
      const context: ComponentInternalInstance = getCurrentInstance();
      const { pdf  } = usePDF();
      const { on, off } = useEventBus('trigger'); // Usar el event bus

      const node = fetch_node(context?.slots as Slots);

     
  
      const update = async (v: any) => {
       
        //console.log("UPDATE Document: Reactivity detected in slot content", context?.vnode?.el?.id);
        //console.log("UPDATE Document: Slot content", context?.vnode?.el);
        //console.log(htmlToJson(context?.vnode?.el));
        const r = await generatePdfFromJson(htmlToJson(context?.vnode?.el))
        pdf.value.pdfBytes = r;
      };
   
      watchEffect(() => {
        update('')
      })

      on(update)
      
 /*       const pages = node.children.map((pageSlot: VNode) => {
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
            contenteditable: "true",
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
  


  