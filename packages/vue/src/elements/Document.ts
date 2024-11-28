import {
  defineComponent,
  getCurrentInstance,
  h,
  useId,
  useSlots,
  watch,
  watchEffect,
  type ComponentInternalInstance,
  type Slots,
} from 'vue';
import { htmlToJson } from '../utils/htmlToJson';
import { usePDF } from '../hook/usePDF';
import { fetch_node } from '../utils';
import { generatePdfFromJson } from '../utils/pdf-json';
import { useEventBus } from '../hook/useEventBus';

export const Document = defineComponent({
  name: 'Document',
  setup(_props) {
    const width = '795px';
    const height = '1000px';
    const id = useId();
    const slots = useSlots();
    const context: ComponentInternalInstance =
      getCurrentInstance() as ComponentInternalInstance;
    const { pdf } = usePDF();
    const { on, off } = useEventBus('trigger'); // Usar el event bus

    const node = fetch_node(context?.slots as Slots);

    const update = async (v: any) => {
      console.log('UPDATE Document: Reactivity detected in slot content', htmlToJson(context?.vnode?.el));
      const r = await generatePdfFromJson(htmlToJson(context?.vnode?.el));
      pdf.value.pdfBytes = r;
    };
    
    watch(() => node, () => {
        console.log('UPDATE Document: Slot content', node);
    });
    watchEffect(() => {
      update('');
    });

    on(update);

    return () =>
      h(
        'div',
        {
          id,
          'data-name': 'DOCUMENT',
          contenteditable: 'true',
          style: {
            width: "795px",
            height: "100%",
            overflowY: "auto", // Scroll solo en el contenedor del documento
            display: "grid", // Usamos grid para distribuir las páginas con espacio
            gap: "20px",  // Espacio entre las páginas
            boxSizing: "border-box", // Asegura que el padding y márgenes se incluyan en el tamaño
            padding: "0px", //
          },
        },
        [
          slots.default?.(),
          h("div", { style: { flexGrow: 1, minHeight: "200px", height: "200px", backgroundColor: "red" } }),
        ]
      );
  },
});
