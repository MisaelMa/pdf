import { PDFDocument, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';
import { Cursor } from './Cursor';
import { Page } from './Page';

export class PDFGenerator {
  private pdfDoc: PDFDocument | null = null;
  private font: PDFFont | null = null;
  private fontSize: number;
  private margin: number;
  private cursor: Cursor | null = null;

  constructor(fontSize: number = 12, margin: number = 50) {
    this.fontSize = fontSize;
    this.margin = margin;
  }

  public async init(): Promise<void> {
    this.pdfDoc = await PDFDocument.create();
    this.font = await this.pdfDoc.embedFont(StandardFonts.Helvetica);
    this.cursor = new Cursor(841.89, this.margin); // Altura de A4
  }

  // Método para añadir texto a varias páginas si es necesario
  public addText(textContent: string): void {
    if (!this.pdfDoc || !this.font || !this.cursor) {
      throw new Error('PDF Document not initialized');
    }

    let page: PDFPage = this.pdfDoc.addPage([595.28, 841.89]); // A4
    let pdfPage = new Page(page, this.font, this.fontSize, this.cursor);

    while (!pdfPage.addText(textContent)) {
      // Si el texto no cabe en la página actual, crear una nueva página
      page = this.pdfDoc.addPage([595.28, 841.89]); // A4
      this.cursor.resetCursor(); // Reiniciar el cursor para la nueva página
      pdfPage = new Page(page, this.font, this.fontSize, this.cursor);
    }
  }

  public async save(): Promise<Uint8Array> {
    if (this.pdfDoc) {
      return await this.pdfDoc.save();
    }
    throw new Error('PDF Document not initialized');
  }
}

/* // Ejemplo de uso
(async () => {
  const pdfGenerator = new PDFGenerator();
  await pdfGenerator.init();
  pdfGenerator.addText("Este es un ejemplo de texto que se divide en líneas en un PDF y puede abarcar varias páginas. ".repeat(100)); // Ejemplo de texto largo
  const pdfBytes = await pdfGenerator.save();

  // Aquí puedes descargar o mostrar el PDF generado
})();
 */