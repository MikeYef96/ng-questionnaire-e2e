import { test, expect } from '../../fixtures/test-fixtures';

/**
 * netlify.toml rewrites /* to /index.html (SPA fallback), so deep links must
 * work and Angular's router decides what the user sees.
 */
test.describe('Routing @regression', () => {
  test('deep link to /management is served by the SPA fallback', async ({ page }) => {
    const response = await page.goto('/management');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/\/management$/);
  });

  test('reloading /management keeps the user on the same route', async ({ page }) => {
    await page.goto('/management');
    await page.reload();
    await expect(page).toHaveURL(/\/management$/);
    await expect(page.locator('body')).toContainText(/\S/);
  });

  test('root URL renders something meaningful', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toContainText(/\S/);
  });

  // Exploratory check: if this fails it is a candidate bug report
  // (unknown route -> blank screen or uncaught exception).
  test('unknown route does not crash or render a blank page', async ({ page, diagnostics }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.locator('body')).toContainText(/\S/);
    expect(diagnostics.consoleErrors, 'console errors').toEqual([]);
  });
});
