import { PDFFont } from 'pdf-lib';

class Text {
  public lines: string[] = [];

  constructor(
    public content: string,
    public fontName: string,
    public fontSize: number,
    public maxWidth: number
  ) {
    this.lines = this.splitIntoLines(content);
  }

  // Método para dividir el texto en líneas
  private splitIntoLines(content: string): string[] {
    const words = content.split(' ');
    let currentLine = '';
    const lines = [];

    for (const word of words) {
      const newLine = currentLine ? `${currentLine} ${word}` : word;

      if (this.getWidthOfText(newLine) <= this.maxWidth) {
        currentLine = newLine;
      } else {
        lines.push(currentLine);
        currentLine = word; // Nueva línea con la palabra actual
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  // Método para obtener el ancho del texto en una línea usando una fuente
  private getWidthOfText(text: string): number {
    // Aquí asumimos un tamaño medio aproximado de los caracteres, ya que en este ejemplo
    // no estamos interactuando directamente con una fuente PDF, pero en un caso real
    // podrías calcular el ancho con la fuente embebida del PDF.
    const avgCharWidth = this.fontSize * 0.6; // Aproximación
    return text.length * avgCharWidth;
  }
}
