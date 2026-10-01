import { type Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page object for /management.
 *
 * TODO (after running `npm run recon`): replace the generic locators below with
 * role/label based ones taken from artifacts/recon/management.aria.yml, e.g.
 *   addQuestionButton = page.getByRole('button', { name: 'Add question' });
 */
export class ManagementPage extends BasePage {
  protected readonly path = '/management';

  readonly headings = this.page.getByRole('heading');
  readonly buttons = this.page.getByRole('button');
  readonly links = this.page.getByRole('link');
  readonly textInputs = this.page.getByRole('textbox');

  constructor(page: Page) {
    super(page);
  }
}
