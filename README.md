# ng-questionnaire-e2e

![e2e](https://github.com/MikeYef96/ng-questionnaire-e2e/actions/workflows/e2e.yml/badge.svg)

End-to-end, accessibility and regression test framework (Playwright + TypeScript) for the
[ng-questionnaire](https://github.com/MikeYef96/ng-questionnaire) Angular app, deployed at
<https://ng-questionnare.netlify.app>.

> Status: framework + smoke/routing/responsive/a11y suites in place. Question-type coverage
> is being added; see [TEST_STRATEGY.md](./TEST_STRATEGY.md) for the plan and risks.

## Quick start

```bash
npm ci
npx playwright install --with-deps
npm test                 # everything except recon
npm run test:smoke       # @smoke only
npm run test:a11y        # axe + keyboard checks
npm run report           # open the last HTML report
BASE_URL=http://localhost:4201 npm test   # run against a local build
```

## Structure

```
config/      environment switching (BASE_URL)
pages/       Page Object Model (base.page.ts, management.page.ts, ...)
fixtures/    custom fixture: collects console errors + failed requests per test
tests/e2e/   smoke, routing, responsive
tests/a11y/  axe-core scan + keyboard navigation
tests/recon/ helper that dumps ARIA tree + element inventory (not run in CI)
.github/     CI workflow (PR, push, nightly) + bug report template
```

## Finding locators fast

```bash
npm run recon
```
Writes `artifacts/recon/*.aria.yml`, `*.json` and screenshots. Use the ARIA tree to write
`getByRole` / `getByLabel` locators in the page objects.

## Architectural trade-offs & decisions

- **Playwright over Cypress:** auto-waiting, native multi-browser (Chromium, Firefox, WebKit),
  built-in parallelism, trace viewer, and one API for UI and API tests. I also know Cypress;
  the choice is about fit for this project, not a verdict on the tool.
- **No fixed sleeps:** all waiting uses web-first assertions (`expect(locator)...`), never
  `waitForTimeout`.
- **Role-based locators first:** `getByRole` / `getByLabel` survive markup changes and double
  as an accessibility check. CSS/XPath only as a last resort.
- **Tests run against the deployed app:** CI validates what users actually get from Netlify.
  Trade-off: results depend on the live deployment; `BASE_URL` allows local runs.
- **Console/network diagnostics fixture:** a "working" screen that logs errors or fires 4xx/5xx
  requests is still a defect, so any test can assert a clean page.
- **Automated a11y is a smoke check, not compliance:** axe finds only a subset of WCAG issues;
  critical violations fail the build, serious ones are annotated.
- **Known limitation:** the app under test uses Angular 13 (Angular CLI 13.0.4); not upgraded on purpose.

## Next steps

- [ ] Question-type matrix tests (valid / invalid / boundary input per type)
- [ ] Visual regression on key screens
- [ ] API tests and `page.route()` mocking, if the app calls a backend
