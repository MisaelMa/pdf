export class Line {
  startX: number;
  startY: number;
  endX: number;
  endY: number;

  constructor(startX: number, startY: number, endX: number, endY: number) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
  }

  toPDFContent(): string {
    return `${this.startX} ${this.startY} m ${this.endX} ${this.endY} l S\n`;
  }
}
