import PDFViewer from "./components/DocuPDF";
import Quixote from "./components/PDFSSR";
import dynamic from "next/dynamic";

//import PDFViewerWithNoSSR from "./components/DocuPDF";
const PDFViewerWithNoSSR = dynamic(() => import("./components/DocuPDF"), {
  ssr: false,
});

export default async function page() {
  const staticData = await fetch(
    `https://api.telweb.app/sat/facturas/pdf?uuid=BFD7FF2B-0491-4768-B7E9-C8516B1BD477`,
    { cache: "force-cache" }
  ).then((response) => response.json());

  return (
    <div>
      {/*   <Quixote /> */}

      <PDFViewerWithNoSSR value={<Quixote />} />
    </div>
  );
}
