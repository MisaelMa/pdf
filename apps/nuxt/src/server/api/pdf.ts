import { PDF, Document, Page, Text, Line ,Style, colorToRGB } from "@pdf.js/kit/src";
export default defineEventHandler((event) => {
  // Crea un nuevo documento
const document = new Document();

// Crea una nueva página
const page1 = new Page();

// Define un estilo para el texto
const textStyle = new Style({
  fontSize: '16',
  color: '0 0 0' // Color negro en formato RGB para PDF
});

// Agrega texto con estilo a la página
page1.addText(new Text('Hello, amir!', textStyle, 100, 700));

// Agrega una línea a la página
//page1.addLine(new Line(100, 680, 500, 680));

// Añade la página al documento
document.addPage(page1);

// Crea un nuevo PDF a partir del documento
const pdf = new PDF(document);

// Guardar el PDF en el sistema de archivos
pdf.saveFile('example', './')

  return {
    hello: "world",
  };
});
