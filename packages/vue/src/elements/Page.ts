import type { Component, FunctionalComponent, Slots } from "vue";
import { computed, defineComponent, defineProps, getCurrentInstance, h, inject, onMounted, provide, ref, useId, useSlots, useTemplateRef, watch } from "vue";
import { fetch_node } from "../utils";
import { useEventBus } from "../hook/useEventBus";
export const Page = defineComponent({
    name: "Page",
    props:{
      style: {
        type: Object,
        required: false,
        default: () => ({}),
      },
      teleported: {
        type: Function,
        required: false,
        default: false,
      }
    },
    setup(props) {
      const id = useId();
      const pageContentId = useId();
      const slots = useSlots(); 
      const context = getCurrentInstance();
      const texts = ref([]);
      const childRef = useTemplateRef<HTMLDivElement>(`page-content-${pageContentId}`);
      const documentPDF = inject('docpdf');

      const pageInfo = ref({id: pageContentId, content: [  ]});
      provide('pageContentId', pageInfo.value);
   

      watch(() => pageInfo, () => {
        //console.log('UPDATE Page: Slot content', pageInfo.value);
        documentPDF.value.content.push(pageInfo.value);
      }, { immediate: true });
     
      const { emit: emitText } = useEventBus('text-overflow');
      const update = () => {
        //console.log("UPDATE Page: Reactivity detected in slot content", context?.vnode?.el?.id);
        //console.log("UPDATE Page: Slot content", memorizedSlot.value);
      };
      
      const checkOverflow = () => {
        const container = childRef.value as HTMLElement;
      
        if (container && container.children.length > 0) {
          const children = Array.from(container.children) as HTMLElement[];
          let overflowingElement = null;
      
          const containerBottom = container.offsetTop + container.offsetHeight;
      
          for (const child of children) {
            const childBottom = child.offsetTop + child.offsetHeight;
      
            // Verifica si la parte inferior del hijo excede la parte inferior del contenedor
            if (childBottom > containerBottom) {
              overflowingElement = child;
              break;
            }
          }
      
          if (overflowingElement) {
            const textId = overflowingElement.id;
            const textIndex = pageInfo.value.content.findIndex((item) => item.id === textId);
      
            if (textIndex !== -1) {
              // Emitir el evento de texto desbordado
              emitText('text-overflow', { pageId: pageContentId, textId });
               pageInfo.value.content.splice(textIndex, 1)
              
            }
          }
        }
      };

      
      const memorizedSlot = computed(() => {
        return fetch_node(context?.slots as Slots)
      });
  
      
      watch(memorizedSlot, () => {
        update(); // Llamado cuando `memorizedSlot` cambia
      });
      
      watch(() => childRef.value, () => {
          checkOverflow();
      });

      onMounted(() => {
        props.teleported && props?.teleported(pageContentId);
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
              id: pageContentId,
              "data-name": `page-content-${pageContentId}`,
              ref: `page-content-${pageContentId}`,
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
            slots.default?.()
          )
        );
    },
  });


