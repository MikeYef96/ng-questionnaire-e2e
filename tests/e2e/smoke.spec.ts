import { test, expect } from '../../fixtures/test-fixtures';
import { ManagementPage } from '../../pages/management.page';

test.describe('Smoke @smoke', () => {
  test('management screen loads with the correct title', async ({ page }) => {
    const management = new ManagementPage(page);
    const response = await management.open();

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle('Questionnaire');
  });

  test('management screen loads without console errors or failed requests', async ({
    page,
    diagnostics,
  }) => {
    await new ManagementPage(page).open();
    await page.waitForLoadState('networkidle');

    expect(diagnostics.consoleErrors, 'console errors').toEqual([]);
    expect(diagnostics.failedRequests, 'failed requests').toEqual([]);
  });

  test('management screen exposes at least one heading', async ({ page }) => {
    const management = new ManagementPage(page);
    await management.open();

    await expect(management.headings.first()).toBeVisible();
  });
});
