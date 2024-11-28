import { Page } from './Page';

export class Document {
  private pages: Page[] = [];

  addPage(page: Page) {
    this.pages.push(page);
  }

  getPages(): Page[] {
    return this.pages;
  }
}
