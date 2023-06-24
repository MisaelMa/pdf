import FontStore from '@react-pdf/font/src';
import PDFDocument from '@react-pdf/pdfkit/src';
import { createRenderer } from './renderer';
// @ts-ignore
import layoutDocument from '@react-pdf/layout/src';
// @ts-ignore
import renderPDF from '@react-pdf/render/src';
const version = '3.1.9';
const fontStore = new FontStore();
// We must keep a single renderer instance, otherwise React will complain
let renderer;

// The pdf instance acts as an event emitter for DOM usage.
// We only want to trigger an update when PDF content changes
const events: any = {};

const pdf = async (initialValue?: any) => {
  const onChange = () => {
    const listeners = events.change?.slice() || [];
    for (let i = 0; i < listeners.length; i += 1) {
      listeners[i]();
    }
  };

  let container: any = { type: 'ROOT', document: null };

  const updateContainer = async (doc: any) => {
    //console.log('aqui updateContainer', doc);

    container = await createRenderer(doc);
    onChange();
    //console.log('aqui container', container);
  };

  if (initialValue) {
    //console.log('initialValue', initialValue);

    container = await createRenderer(initialValue);
  }

  const render = async (compress = true) => {
    //console.log('container render', container);

    const props = container.document?.props || {};
    const { pdfVersion, language, pageLayout, pageMode } = props;
    // @ts-ignore
    const ctx = new PDFDocument({
      compress,
      pdfVersion,
      lang: language,
      displayTitle: true,
      autoFirstPage: false,
      pageLayout,
      pageMode,
    });
    const layout = await layoutDocument(container.document, fontStore);
    const fileStream = renderPDF(ctx, layout);
    return { layout, fileStream };
  };

  const toBlob = async () => {
    const chunks: any = [];
    //console.log('toBlob', container);

    const { layout: _INTERNAL__LAYOUT__DATA_, fileStream: instance } =
      await render();

    return new Promise((resolve, reject) => {
      instance.on('data', (chunk: any) => {
        chunks.push(
          chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk)
        );
      });

      instance.on('end', () => {
        try {
          const blob = new Blob(chunks, { type: 'application/pdf' });
          //callOnRender({ blob, _INTERNAL__LAYOUT__DATA_ });
          resolve(blob);
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  // TODO: rename this method to `toStream` in next major release, because it return stream not a buffer
  const toBuffer = async () => {
    // callOnRender();
    return (await render()).fileStream;
  };

  const callOnRender = (params = {}) => {
    if (container.document.props.onRender) {
      container.document.props.onRender(params);
    }
  };
  /*
   * TODO: remove this method in next major release. it is buggy
   * see
   * - https://github.com/diegomura/react-pdf/issues/2112
   * - https://github.com/diegomura/react-pdf/issues/2095
   */
  const toString = async () => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '`toString` is deprecated and will be removed in next major release'
      );
    }

    let result = '';
    const { fileStream: instance } = await render(false); // For some reason, when rendering to string if compress=true the document is blank

    return new Promise((resolve, reject) => {
      try {
        instance.on('data', (buffer) => {
          result += buffer;
        });

        instance.on('end', () => {
          callOnRender();
          resolve(result);
        });
      } catch (error) {
        reject(error);
      }
    });
  };
  const on = (event: string, listener: any) => {
    console.log('aqui en on');
    if (!events[event]) events[event] = [];
    events[event].push(listener);
  };

  const removeListener = (event: string, listener: any) => {
    if (!events[event]) return;
    const idx = events[event].indexOf(listener);
    if (idx > -1) events[event].splice(idx, 1);
  };
  return {
    on,
    removeListener,
    updateContainer,
    container,
    toBlob,
    toBuffer,
    toString,
  };
};

const Font = fontStore;

const StyleSheet = {
  create: (s: any) => s,
};

export { version, Font, StyleSheet, pdf, createRenderer };
