
import Pdf from "./components/Pdf";
/* const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);
 */
//import PDFViewerWithNoSSR from "./components/DocuPDF";
/* const PDFViewerWithNoSSR = dynamic(() => import("./components/DocuPDF"), {
  ssr: false,
}); */

export default async function page() {
 
  return (
    <div>
     <Pdf></Pdf>

   {/*  <PDFViewerWithNoSSR value={<Quixote />} />   */}
    </div>
  );
}
