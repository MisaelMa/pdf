/* import FontStore from "@react-pdf/font/src";
import PDFDocument from "@react-pdf/pdfkit/src";
import createRenderer from "./renderer";
import layoutDocument from "@react-pdf/layout/src";
import renderPDF from "@react-pdf/render/src";
const version = "3.1.9";
const fontStore = new FontStore();

export const renderVuePdf = async (container: any = {}, compress = true) => {
  const props = container.document.props || {};
  const { pdfVersion, language, pageLayout, pageMode } = props;

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

export const toBlob = async (container: any = {}) => {
  const chunks = [];
  const { layout: _INTERNAL__LAYOUT__DATA_, fileStream: instance } =
    await renderVuePdf(container);

  return new Promise((resolve, reject) => {
    instance.on("data", (chunk: any) => {
      chunks.push(chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk));
    });

    instance.on("end", () => {
      try {
        const blob = new Blob(chunks, { type: "application/pdf" });
        console.log("container Blob", container);
        //callOnRender({ blob, _INTERNAL__LAYOUT__DATA_ });
        resolve(blob);
      } catch (error) {
        reject(error);
      }
    });
  });
};
 */