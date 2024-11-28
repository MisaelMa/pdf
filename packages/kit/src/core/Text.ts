import { Style } from './Style';

export class Text {
  content: string;
  style: Style;
  x: number;
  y: number;

  constructor(content: string, style: Style, x: number, y: number) {
    this.content = content;
    this.style = style;
    this.x = x;
    this.y = y;
  }

  toPDFContent(): string {
    const styleContent = this.style.toPDFContent();
    return `${styleContent}${this.x} ${this.y} Td (${this.content}) Tj\n`;
  }
}
