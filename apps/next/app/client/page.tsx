"use client";

import { PDFViewer } from "@react-pdf/renderer/src/dom";
import Quixote from "../components/PDFCSR";
export default async function page() {
  return (
    <div>
      SSS
      <PDFViewer>
        <Quixote />
      </PDFViewer>
    </div>
  );
}
