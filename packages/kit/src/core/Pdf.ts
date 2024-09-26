import * as fs from 'fs';
import * as path from 'path';
import { Document } from './Document';

export class PDF {
  private document: Document;

  constructor(document: Document) {
    this.document = document;
  }

  private getObjectNumber(): number {
    return this.document.getPages().length * 2 + 1; // Asumiendo 2 objetos por página
  }

  generatePDFContent(): string {
    let pdfContent = `%PDF-1.4\n`;
    let content = '';
    let xref = 'xref\n0 1\n0 00000 n \n'; // Iniciamos con una entrada de referencia cruzada para el catalogo
    let objectNumber = 1;

    // Generar el contenido para cada página
    this.document.getPages().forEach((page, index) => {
      // Página
      content += `${objectNumber} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${objectNumber + 1} 0 R >>\nendobj\n`;
      xref += `${objectNumber * 100000} 00000 n \n`; // Referencia cruzada para el objeto de la página
      objectNumber++;

      // Contenido de la página
      const pageContent = page.toPDFContent(objectNumber);
      content += `${objectNumber} 0 obj\n<< /Length ${pageContent.length} >>\nstream\n${pageContent}\nendstream\nendobj\n`;
      xref += `${objectNumber * 100000} 00000 n \n`; // Referencia cruzada para el objeto de contenido
      objectNumber++;
    });

    // Añadir el catálogo (Root)
    content += `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;

    // Agregar el contenido de los objetos
    pdfContent += content;

    // Generar la tabla de referencias cruzadas y el trailer
    pdfContent += xref;
    pdfContent += `trailer\n<< /Size ${this.getObjectNumber()} /Root 1 0 R >>\n`;
    pdfContent += `startxref\n${this.getObjectNumber() * 100000 - 100000}\n%%EOF`;

    return pdfContent;
  }

  // Método para guardar el PDF en el sistema de archivos (Node.js)
  saveFile(filename: string, directory: string = './') {
    const content = this.generatePDFContent();
    const filePath = path.join(directory, `${filename}.pdf`);

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`PDF saved at: ${filePath}`);
  }
}
