import { PDFDocument, rgb, StandardFonts, PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit"; // Para fuentes personalizadas

const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r / 255, g / 255, b / 255];
};

// Procesa el JSON y genera el PDF
export async function generatePdfFromJson(jsonData: any): Promise<Uint8Array> {
  // Crear un nuevo documento PDF
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit); // Registrar fontkit para fuentes personalizadas
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  for (const child of jsonData.children) {
    if (child.tag === "page") {
      const page = pdfDoc.addPage(); // Tamaño A4
      await processPage(child, pdfDoc, page, timesRomanFont);
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
  // download(pdfBytes, "generated.pdf", "application/pdf");
}

// Función para procesar una página del JSON
async function processPage(jsonPage: any, doc: any, page: PDFPage, font: any) {
 for (const element of jsonPage.children) {
 //   console.log(element);
    if (element.tag === "text" || element.tag === "span") {
      await processTextElement(element, page, font);
    } else if (element.tag === "image") {
      await processImageElement(element.children[0], doc, page);
    }
  }


}

function processText(page: any, text: string, font: any) {
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();
  
    // Tamaño de la fuente
    const fontSize = 12
  
    // Calcular el ancho del texto
    const textWidth = font.widthOfTextAtSize(text, fontSize);

  
    // Calcular la posición centrada horizontalmente (x)
    const x = (pageWidth - textWidth) / 2;
  
    // Calcular la posición centrada verticalmente (y)
    const textHeight = fontSize;  // Aproximadamente la altura del texto
    const y = (pageHeight - textHeight) / 2;

    return {
        x,
        y,
    }
}
function processTextElement(element: any, page: PDFPage, font: any) {
  const content = element.children.map((child: any) => child.content).join(" ");
  const fontSize = parseInt(element.attributes?.style?.fontSize) || 12;
  const color = element.attributes?.style?.color
    ? hexToRgb(element.attributes.style.color)
    : [0, 0, 0];
  const { left, top, width, height } = element.attributes?.style;
  const x = left || 50;
  const y = page.getHeight() - top - height;

  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
/*   console.log(`
    pageWidth: ${pageWidth},
    pageHeight: ${pageHeight},
    `)
  console.log(`
    x: ${x},
    y: ${y},
 `) */
 const pt = processText(page, content, font);
/*  console.log(`
    x: ${pt.x},
    y: ${pt.y},
 `) */
  page.drawText(content, {
    x: pt.x,
    y: pt.y,
    size: fontSize,
    color: rgb(0, 0, 0),
    
  });
}



async function processImageElement(element: any, pdfDoc: any, page: any) {
  const imgSrc = element.attributes.src;
  const pngImageBytes = await fetch(imgSrc).then((res) => res.arrayBuffer());

  const pngImage = await page.doc.embedPng(pngImageBytes);
  const pngDims = pngImage.scale(0.5);

  page.drawImage(pngImage, {
    x: page.getWidth() / 2 - pngDims.width / 2 + 75,
    y: page.getHeight() / 2 - pngDims.height,
    width: pngDims.width,
    height: pngDims.height,
  });
}

