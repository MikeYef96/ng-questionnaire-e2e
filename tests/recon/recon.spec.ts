import fs from 'node:fs';
import path from 'node:path';
import { test } from '@playwright/test';

/**
 * Recon helper, NOT a regression test (excluded from `npm test` and CI).
 * Run:  npm run recon
 * It saves, per route, an ARIA snapshot (role/name tree), a full-page screenshot
 * and a JSON inventory of interactive elements into ./artifacts/recon/.
 * Use the output to write role-based locators and plan the question-type matrix.
 */
const routes = [
  { name: 'root', url: '/' },
  { name: 'management', url: '/management' },
];

for (const route of routes) {
  test(`recon ${route.name} @recon`, async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'recon runs on chromium only');

    const out = path.join('artifacts', 'recon');
    fs.mkdirSync(out, { recursive: true });

    await page.goto(route.url);
    await page.waitForLoadState('networkidle');

    fs.writeFileSync(
      path.join(out, `${route.name}.aria.yml`),
      await page.locator('body').ariaSnapshot(),
    );
    await page.screenshot({ path: path.join(out, `${route.name}.png`), fullPage: true });

    const inventory = await page.evaluate(() => {
      const pick = (sel: string) =>
        Array.from(document.querySelectorAll<HTMLElement>(sel)).map((el) => ({
          tag: el.tagName.toLowerCase(),
          text: (el.innerText || '').trim().slice(0, 80),
          id: el.id || undefined,
          name: el.getAttribute('name') || undefined,
          type: el.getAttribute('type') || undefined,
          placeholder: el.getAttribute('placeholder') || undefined,
          ariaLabel: el.getAttribute('aria-label') || undefined,
          href: el.getAttribute('href') || undefined,
        }));
      return {
        url: location.href,
        title: document.title,
        headings: pick('h1,h2,h3,h4'),
        links: pick('a[href]'),
        buttons: pick('button,[role="button"]'),
        fields: pick('input,select,textarea,[contenteditable="true"]'),
      };
    });
    fs.writeFileSync(path.join(out, `${route.name}.json`), JSON.stringify(inventory, null, 2));
  });
}
