import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit'; // Para fuentes personalizadas

// Función para convertir hex a RGB
const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r / 255, g / 255, b / 255];
};

// Procesa el JSON y genera el PDF
export async function generatePdfFromJson(jsonData: any) {

  // Crear un nuevo documento PDF
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit); // Registrar fontkit para fuentes personalizadas
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // Crear página
  const page = pdfDoc.addPage([595, 842]); // Tamaño A4
  const { width, height } = page.getSize();

  // Procesar cada elemento del JSON
  jsonData.children.forEach((child: any) => {
    if (child.tag === 'page') {
      processPage(child, page, timesRomanFont);
    }
  });

  // Generar el PDF
  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, "generated.pdf", "application/pdf");
}

// Función para procesar una página del JSON
function processPage(jsonPage: any, page: any, font: any) {
  jsonPage.children.forEach((element: any) => {
    if (element.tag === 'text') {
      processTextElement(element, page, font);
    } else if (element.tag === 'image') {
      processImageElement(element, page);
    }
  });
}

// Función para procesar elementos de texto
function processTextElement(element: any, page: any, font: any) {
  const content = element.children.map((child: any) => child.content).join(' ');
  const fontSize = parseInt(element.attributes?.style?.['font-size']) || 12;
  const color = element.attributes?.style?.color ? hexToRgb(element.attributes.style.color) : [0, 0, 0];
  
  // Añadir texto a la página
  page.drawText(content, {
    x: 50,
    y: page.getHeight() - 100,
    size: fontSize,
    font: font,
    color: rgb(...color)
  });
}

// Función para procesar imágenes
async function processImageElement(element: any, page: any) {
  // Aquí puedes cargar y dibujar la imagen
  const imgSrc = element.children[0].attributes.src;
  
  // Ejemplo básico de agregar una imagen desde URL
  const pngImageBytes = await fetch(imgSrc).then((res) => res.arrayBuffer());
  const pngImage = await page.doc.embedPng(pngImageBytes);
  
  page.drawImage(pngImage, {
    x: 100,
    y: page.getHeight() - 300,
    width: 200,
    height: 200,
  });
}

// Función para descargar el PDF
function download(blob: BlobPart, filename: string, mimeType: string) {
  const blobData = new Blob([blob], { type: mimeType });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blobData);
  link.download = filename;
  link.click();
}

// Llamar a la función para generar el PDF
generatePdfFromJson();
