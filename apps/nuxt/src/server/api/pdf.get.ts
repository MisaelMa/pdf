/* import Pdf from "../../components/pdf.vue";
import { pdf } from "@pdf.js/vue"; */
import { sendStream } from "h3";

export default defineEventHandler(async (event) => {
  if (event.req.method === "GET") {
    console.log(Pdf);

    /* const d = await pdf(Pdf);
    const pdfStream = d.toBuffer();
    //event.setHeader("Content-Type", "application/pdf");
    return sendStream(event, pdfStream); */
    return { f: 3 };
  }
  if (event.req.method === "POST") {
    // create a blog
    // return the blog;
  }
});
