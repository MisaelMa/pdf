import { ref } from 'vue'
const pdf  = ref<{pdfBytes: BlobPart | Uint8Array | null, pages: any[]}>({
    pdfBytes: null,
    pages: []
})

function download_pdf(blob: BlobPart, filename: string, mimeType: string) {
    const blobData = new Blob([blob], { type: mimeType });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blobData);
    link.download = filename;
    link.click();
  }

export const usePDF = () => {
    const download = async () => {
/*         const pdfBytes = await generatePdfFromJson(pdf.value);
        pdf.value.pdfBytes = pdfBytes;
 */        download_pdf(pdf.value.pdfBytes as BlobPart, "generated.pdf", "application/pdf");
    }
    return {
        pdf,
        download
    }
}