export class Cursor {
    public x: number;
    public y: number;
    private pageHeight: number;
    private margin: number;
  
    constructor(pageHeight: number, margin: number) {
      this.pageHeight = pageHeight;
      this.margin = margin;
      this.x = margin;
      this.y = pageHeight - margin; // Inicia en la esquina superior izquierda
    }
  
    // Método para mover el cursor verticalmente (para escribir nuevas líneas de texto)
    public moveY(distance: number): void {
      this.y -= distance;
    }
  
    // Método para reiniciar el cursor al principio de una nueva página
    public resetCursor(): void {
      this.x = this.margin;
      this.y = this.pageHeight - this.margin;
    }
  
    // Verifica si el cursor necesita moverse a una nueva página
    public needsNewPage(lineHeight: number): boolean {
      return this.y - lineHeight < this.margin;
    }
  }
  