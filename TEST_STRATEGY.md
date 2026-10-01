# Test strategy: ng-questionnaire

App under test: <https://ng-questionnare.netlify.app> (Angular 13 SPA, Netlify, SPA fallback to `/index.html`).
Routes known so far: `/`, `/management`.

Findings below reflect the first Playwright run and a short exploratory recon on
2026-10-01. Persistence and detailed validation behavior still need hands-on testing.

## 1. Scope

In scope: questionnaire management screen, question types, validation, navigation and state,
routing/deep links, responsive layout, basic accessibility, cross-browser (Chromium/Firefox/WebKit).
Out of scope: load/performance testing, security testing of third-party infrastructure (Netlify).

## 2. Risk assessment

| Risk                                            | Impact | Likelihood          | Covered by                      |
| ----------------------------------------------- | ------ | ------------------- | ------------------------------- |
| Deep link / refresh breaks the SPA route        | High   | Low                 | `routing.spec.ts`               |
| Unknown route shows blank screen                | Medium | Medium              | `routing.spec.ts` (exploratory) |
| User-entered data lost on refresh or navigation | High   | Unknown; not tested | Manual flow checks pending      |
| Validation accepts/rejects wrong input          | High   | Unknown; not tested | Question-type matrix pending    |
| Layout breaks on small screens                  | Medium | Medium              | `responsive.spec.ts`            |
| Screen unusable with keyboard / screen reader   | Medium | Medium              | `a11y.spec.ts`                  |
| Console errors / failed requests on load        | Medium | Medium              | `smoke.spec.ts`                 |

## 3. Test levels

- **Unit:** Karma/Jasmine specs in the app repo (`ng test`).
- **E2E:** Playwright against the deployed app (this repo).
- **Manual/exploratory:** charters per feature before automating.

## 4. Question-type matrix

The Create question screen exposes three types. Single and Multiple display an
"Add Answer Option" button; clicking it adds an "Enter your answer option" textbox.
Text does not display answer-option controls. The title textbox is labeled
"QuestionType title" and marked required. Input boundaries and submission behavior
have not yet been explored, so those cases remain pending.

| Question type | Observed controls                                        | Valid/empty | Boundary and special characters | Notes              |
| ------------- | -------------------------------------------------------- | ----------- | ------------------------------- | ------------------ |
| Single        | Required title; Add Answer Option; answer-option textbox | Not tested  | Not tested                      | Type is selectable |
| Multiple      | Required title; Add Answer Option; answer-option textbox | Not tested  | Not tested                      | Type is selectable |
| Text          | Required title; no answer-option control observed        | Not tested  | Not tested                      | Type is selectable |

## 5. Flow and state checks

- Observed: `/` resolves to `/management`; selecting Create question navigates to `/create`.
- Observed: selecting Single or Multiple shows Add Answer Option; clicking it adds an
  answer-option textbox. Selecting Text hides that control.
- Automated checks: `/management` deep link and reload pass; the unknown route renders
  a blank page in all three tested browsers.
- Not yet tested: browser back/forward, refresh with entered data, deep-linking to `/create`,
  double submission, multiple tabs, and browser back after submission.

## 6. Entry / exit criteria

Entry: deployed build reachable and `BASE_URL` configured in GitHub Actions repository
variables. Exit: all `@smoke` tests green, no open critical or major bugs, and known issues
listed in the README. The Actions workflow runs on pull requests, pushes to `main`, nightly,
and manual dispatch; it runs typecheck and Playwright, then publishes the report to GitHub Pages
when configured.

## 7. Bugs found

The first run produced 12 failures: three findings repeated across Chromium, Firefox, and
WebKit. No issue links have been created yet.

| Finding                                                                                               | Evidence                                                        | Status                                         |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------- |
| Management screen's icon-only Create question button has no accessible name (`button-name`).          | `tests/a11y/a11y.spec.ts`; Axe failure in all three browsers.   | Bug candidate; report in the application repo. |
| Management layout overflows horizontally at 320px and 375px. The 320px run measured 84px of overflow. | `tests/e2e/responsive.spec.ts`; failures in all three browsers. | Bug candidate; report in the application repo. |
| Unknown route `/this-route-does-not-exist` renders a blank page.                                      | `tests/e2e/routing.spec.ts`; failure in all three browsers.     | Bug candidate; report in the application repo. |

Use the repository's bug report template when filing these in the application repo. No defects
were intentionally injected.
