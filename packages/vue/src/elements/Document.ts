import {
  defineComponent,
  getCurrentInstance,
  h,
  provide,
  ref,
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
import { EventBusListener, useEventBus } from '../hook/useEventBus';
import { Page } from './Page';
interface ExtraPage {textId: string, emitPageId:string}

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
    const extraPages = ref<ExtraPage[]>([]);
    const { on, off } = useEventBus('trigger');
    const { on: onPage, } = useEventBus('page-overflow');
    const { emit: emitTeleport } = useEventBus('text-teleport');
    const node = fetch_node(context?.slots as Slots);
    const codInfo = ref({id, content: [], extraPages:[]});
    provide('docpdf',codInfo);
    const update = async (v: any) => {
      //console.log('UPDATE Document: Reactivity detected in slot content', htmlToJson(context?.vnode?.el));
      const r = await generatePdfFromJson(htmlToJson(context?.vnode?.el));
      pdf.value.pdfBytes = r;
    };
    
   
    on(update);

    onPage((eventName, payload) => {
      const emitPageId = payload.emitPageId;
      const indexPage = codInfo.value.content.findIndex((page) => page.id === emitPageId);
      const existNextPage = codInfo.value.content[indexPage + 1];
      if (existNextPage) {
        //console.log('onPage', eventName, payload, existNextPage);
        console.log('existNextPage', { textId: payload.textId, to: existNextPage.id });
        //emitTeleport('text-teleport', { textId: payload.textId, to: existNextPage.id });
      } else {
        console.log('onPage', eventName, payload);
        codInfo.value.extraPages.push(payload);
        console.log('onPage', codInfo.value);
  
      }
    });

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
          h('div', {}, extraPages.value.length),
          codInfo.value.extraPages.map((page) => h(Page, { style: { width, height }, teleported: (pageId: any)=> {
              emitTeleport('text-teleport', { textId: page.textId, to:pageId });
          }} )),
          h("div", { style: { flexGrow: 1, minHeight: "200px", height: "200px", backgroundColor: "red" } }),
        ]
      );
  },
});
