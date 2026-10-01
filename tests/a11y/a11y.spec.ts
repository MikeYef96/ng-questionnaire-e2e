import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Accessibility @a11y', () => {
  test('management screen has no critical axe violations', async ({ page }, testInfo) => {
    await page.goto('/management');
    await expect(page.locator('body')).toContainText(/\S/);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    await testInfo.attach('axe-results', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });

    const serious = results.violations.filter((v) => v.impact === 'serious');
    if (serious.length) {
      testInfo.annotations.push({
        type: 'serious-a11y',
        description: serious.map((v) => `${v.id} (${v.nodes.length} nodes)`).join(', '),
      });
    }

    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(
      critical.map((v) => `${v.id}: ${v.help}`),
      'critical accessibility violations',
    ).toEqual([]);
  });

  test('keyboard: Tab moves focus onto an interactive element', async ({ page }) => {
    await page.goto('/management');
    await expect(page.locator('body')).toContainText(/\S/);

    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedTag).not.toBe('BODY');
  });
});
