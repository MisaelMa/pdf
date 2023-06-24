"use client";

//import * as pdfjs from 'pdfjs-dist';

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import styled from "@emotion/styled";

//import { pdfjs } from 'react-pdf';

//pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const Document = dynamic(
  () =>
    import("react-pdf").then((mod) => {
      mod.pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${mod.pdfjs.version}/pdf.worker.js`;
      return mod.Document;
    }),
  { ssr: false }
);
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

const WrapperDiv = styled("div")(({ theme }: any) => ({
  height: 1000,
  width: 680,
  elevation: 5,
  variant: "outlined",
  borderRadius: "10px",
}));

const PdfPage = ({ pdf }: any) => {
  const [numPages, setNumPages] = useState(null);

  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  const fileName = "factura.pdf";

  function descarga() {
    const downloadLink = document.createElement("a");
    downloadLink.href = pdf;
    downloadLink.download = fileName;
    downloadLink.click();
  }
  useEffect(() => {
    /* if (typeof window !== undefined) {
      console.log(pdfjs);

      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    } */
  }, []);

  return (
    <>
      <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
    </>
  );
};
export default PdfPage;
