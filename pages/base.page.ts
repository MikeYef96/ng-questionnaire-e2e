import { type Page, expect } from '@playwright/test';

export abstract class BasePage {
  /** Route this page object represents, e.g. '/management'. */
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async open() {
    const response = await this.page.goto(this.path);
    await this.waitForAppReady();
    return response;
  }

  /** Angular bootstraps client-side: wait until something real is rendered. */
  async waitForAppReady() {
    await expect(this.page.locator('body')).toContainText(/\S/);
  }
}
