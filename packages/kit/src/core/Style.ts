export class Style {
  private styles: { [key: string]: string | number };

  constructor(styles: { [key: string]: string | number } = {}) {
    this.styles = styles;
  }

  get(property: string): string | number {
    return this.styles[property];
  }

  set(property: string, value: string | number) {
    this.styles[property] = value;
  }

  toPDFContent(): string {
    let pdfStyles = '';
    if (this.styles.fontSize) {
      pdfStyles += `/F1 ${this.styles.fontSize} Tf `;
    }
    if (this.styles.color) {
      pdfStyles += `${this.styles.color} rg `;
    }
    return pdfStyles;
  }
}
