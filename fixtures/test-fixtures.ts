import { test as base, expect } from '@playwright/test';

export interface Diagnostics {
  consoleErrors: string[];
  failedRequests: string[];
}

/**
 * Collects browser console errors, uncaught exceptions and failed HTTP
 * responses for every test, so any spec can assert "the page was clean".
 */
export const test = base.extend<{ diagnostics: Diagnostics }>({
  diagnostics: async ({ page }, use) => {
    const d: Diagnostics = { consoleErrors: [], failedRequests: [] };

    page.on('console', (msg) => {
      if (msg.type() === 'error') d.consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => d.consoleErrors.push(`pageerror: ${err.message}`));
    page.on('response', (res) => {
      const url = res.url();
      if (res.status() >= 400 && !url.endsWith('favicon.ico')) {
        d.failedRequests.push(`${res.status()} ${url}`);
      }
    });

    await use(d);
  },
});

export { expect };
