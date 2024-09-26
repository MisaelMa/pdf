import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';

import { pdf } from './index';
import queue from 'queue';

const usePDF = ({ document = null }: any) => {
  const pdfInstance = ref<any>(null);

  const state = reactive({
    url: '',
    blob: null,
    error: null,
    loading: false,
  });

  onMounted(async () => {
    const renderQueue = queue({ autostart: true, concurrency: 1 });

    const queueDocumentRender = async () => {
      //console.log('llamdo');

      state.loading = true;

      renderQueue.splice(0, renderQueue.length, async () =>
        state.error ? Promise.resolve() : await pdfInstance.value.toBlob()
      );
    };

    const onRenderFailed = (error: any) => {
      console.error(error);
      state.error = error;
    };

    const onRenderSuccessful = (blob: any) => {
      //console.log('onRenderSuccessful', blob);

      state.blob = blob;
      state.error = null;
      state.loading = false;
      state.url = URL.createObjectURL(blob);
      //console.log(state.url);
    };

    pdfInstance.value = await pdf();
    //console.log('montado', pdfInstance.value);

    pdfInstance.value.on('change', queueDocumentRender);
    //document && pdfInstance.value.updateContainer(document);

    renderQueue.on('error', onRenderFailed);
    renderQueue.on('success', onRenderSuccessful);

    onBeforeUnmount(() => {
      renderQueue.end();
      pdfInstance.value.removeListener('change', queueDocumentRender);
    });
  });

  onBeforeUnmount(() => {
    if (state.url) {
      URL.revokeObjectURL(state.url);
    }
  });

  const update = async (doc?: any) => {
    //console.log('AQUIE EN UPDATE');
    if (!pdfInstance.value) {
      pdfInstance.value = await pdf();
    }
    //console.log(pdfInstance.value);

    return doc && await pdfInstance.value?.updateContainer(doc);
  };

  const reference = computed(() => pdfInstance.value);

  return { state, update, reference };
};

export default usePDF;
