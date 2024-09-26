import { Text } from './Text';

export class Page {
  private texts: Text[] = [];

  addText(text: Text) {
    this.texts.push(text);
  }

  toPDFContent(objectNumber: number): string {
    let content = '';
    this.texts.forEach(text => {
      content += text.toPDFContent();
    });
    return content;
  }
}
