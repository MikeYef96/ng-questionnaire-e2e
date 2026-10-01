import { test, expect } from '../../fixtures/test-fixtures';

const viewports = [
  { name: 'small phone', width: 320, height: 640 },
  { name: 'phone', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

test.describe('Responsive layout @regression', () => {
  for (const vp of viewports) {
    test(`no horizontal overflow on ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/management');
      await expect(page.locator('body')).toContainText(/\S/);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(1);
    });
  }
});
