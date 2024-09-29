import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from "pdf-lib";

export class PDFGenerator {
  pdfDoc!: PDFDocument;
  page!:PDFPage;
  font!: PDFFont;
  fontSize = 12;
  pageSize: [number, number] = [595.28, 841.89];
  margin = 0;
  cursor = { x: 0, y: 0 };

  constructor(pageSize: [number, number] = [595.28, 841.89], fontSize = 12, margin = 50) {
    this.fontSize = fontSize;
    this.pageSize = pageSize;
    this.margin = margin;
    this.cursor = { x: margin, y: pageSize[1] - margin };
  }

  async init() {
    this.pdfDoc = await PDFDocument.create();
    this.font = await this.pdfDoc.embedFont(StandardFonts.Helvetica);
    this.addPage();
  }

  // Añadir una nueva página al PDF
  addPage() {
    this.page = this.pdfDoc.addPage(this.pageSize);
    this.resetCursor();
  }

  // Reiniciar el cursor a los márgenes de la nueva página
  resetCursor() {
    this.cursor.x = this.margin;
    this.cursor.y = this.pageSize[1] - this.margin;
  }

  // Actualizar el cursor después de agregar texto
  updateCursorAfterText(text: string) {
    const textWidth = this.font.widthOfTextAtSize(text, this.fontSize);
    this.cursor.x += textWidth;
    if (this.cursor.x > this.pageSize[0] - this.margin) {
      this.newLine();
    }
  }

  // Insertar texto en el PDF en la posición actual del cursor
  addText(text: string, options: any = {}) {
    const {
      x = this.cursor.x,
      y = this.cursor.y,
      fontSize = this.fontSize,
    } = options;

    // Si el texto excede el ancho de la página, pasa a la siguiente línea
    const textWidth = this.font.widthOfTextAtSize(text, fontSize);
    if (this.cursor.x + textWidth > this.pageSize[0] - this.margin) {
      this.newLine();
    }

    // Dibujar el texto
    this.page.drawText(text, {
      x: x,
      y: y,
      size: fontSize,
      font: this.font,
      color: rgb(0, 0, 0),
    });

    // Actualizar la posición del cursor después de insertar el texto
    this.updateCursorAfterText(text);
  }

  // Mover el cursor a una nueva línea
  newLine() {
    this.cursor.x = this.margin; // Volver al margen izquierdo
    this.cursor.y -= this.fontSize + 10; // Bajar una línea
    if (this.cursor.y < this.margin) {
      this.addPage(); // Añadir una nueva página si se supera el margen inferior
    }
  }

  // Mover el cursor manualmente
  moveCursor(x: number, y: number) {
    this.cursor.x = x !== undefined ? x : this.cursor.x;
    this.cursor.y = y !== undefined ? y : this.cursor.y;
  }

  // Método para obtener el PDF en bytes
  async save() {
    return await this.pdfDoc.save();
  }
}

// Ejemplo de uso
async function createPdf() {
  const pdfGenerator = new PDFGenerator();

  // Inicializar el PDF
  await pdfGenerator.init();

  // Añadir texto
  pdfGenerator.addText("Este es el primer párrafo.");
  pdfGenerator.newLine(); // Salto de línea
  pdfGenerator.addText("Este es el segundo párrafo.");
  pdfGenerator.newLine(); // Salto de línea
  pdfGenerator.addText("Texto adicional en una nueva línea.");

  // Mover el cursor manualmente
  pdfGenerator.moveCursor(100, 600); // Cambiar el cursor a coordenadas (100, 600)
  pdfGenerator.addText("Texto después de mover el cursor.");

  // Guardar el PDF
  const pdfBytes = await pdfGenerator.save();

  // Manejar el PDF generado (mostrar, descargar, etc.)
}
