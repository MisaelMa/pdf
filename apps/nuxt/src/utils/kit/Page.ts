import { PDFPage, rgb, PDFFont } from 'pdf-lib';
import type { Cursor } from './Cursor';
import Text from './Text';
export class Page {
  private pdfPage: PDFPage; // Referencia a la página del PDF
  private font: PDFFont; // Fuente de la página
  private fontSize: number;
  private cursor: Cursor;

  constructor(pdfPage: PDFPage, font: PDFFont, fontSize: number, cursor: Cursor) {
    this.pdfPage = pdfPage;
    this.font = font;
    this.fontSize = fontSize;
    this.cursor = cursor;
  }

  // Método para añadir texto a la página usando el cursor compartido
  public addText(textContent: string): boolean {
    const text = new Text(textContent, 'Helvetica', this.fontSize, this.pdfPage.getWidth() - 2 * this.cursor.x);

    for (const line of text.lines) {
      // Comprobar si hay espacio suficiente en la página actual
      if (this.cursor.needsNewPage(this.fontSize)) {
        return false; // No hay espacio suficiente, se debe crear una nueva página
      }

      // Dibuja la línea de texto
      this.pdfPage.drawText(line, {
        x: this.cursor.x,
        y: this.cursor.y,
        size: this.fontSize,
        font: this.font,
        color: rgb(0, 0, 0),
      });

      // Mover el cursor hacia abajo
      this.cursor.moveY(this.fontSize + 5); // Ajustar espacio entre líneas
    }

    return true; // Texto agregado exitosamente
  }
}
