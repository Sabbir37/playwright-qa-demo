# Playwright QA Demo

[![Playwright tests](https://github.com/Sabbir37/playwright-qa-demo/actions/workflows/playwright.yml/badge.svg)](https://github.com/Sabbir37/playwright-qa-demo/actions/workflows/playwright.yml)
**[View the latest test report →](https://sabbir37.github.io/playwright-qa-demo/)**

UI, API and accessibility test automation with **Playwright + TypeScript**, written the way I test real products: plan by risk, automate what matters most, and report bugs so a developer can fix them without asking a single question.

Targets are public practice apps, so anyone can clone and run this:
- **UI:** [SauceDemo](https://www.saucedemo.com), a demo online store
- **API:** [Restful Booker](https://restful-booker.herokuapp.com), a demo hotel booking API

## How I work

1. **Plan by risk.** List what can break and how much it would hurt, then rank it P1 to P3 → [TEST-PLAN.md](TEST-PLAN.md)
2. **Automate the high-risk paths first**, on desktop and mobile, and keep the rare or visual checks manual.
3. **Report every bug** with steps, expected vs. actual, severity and a screenshot → [BUGS.md](BUGS.md)
4. **Keep known bugs in the suite**, so the day one is fixed, the run says so.
5. **Run it on every push** (GitHub Actions) and publish the report where anyone can open it.

I use Claude Code as a pair while writing and debugging tests. I review and run every test myself.

## What is covered

| Area | Tests | What they check |
|---|---|---|
| Login | 6 | valid login, locked user, wrong password, empty fields, page protection without login |
| Product list | 6 | 6 products with prices, sort by price both ways, sort by name, cart badge, cart kept after reload |
| Checkout | 4 | full order with total = subtotal + tax, required First Name, Last Name and Postal Code |
| Accessibility | 4 | axe-core WCAG 2.1 AA scan of 3 pages, login with the keyboard only |
| Known bugs | 5 | real bugs on the `problem_user` and `error_user` accounts, see [BUGS.md](BUGS.md) |
| Booking API | 7 | auth token, bad credentials, create, read, update without token (403), partial update, delete then 404 |

UI tests run on **desktop Chrome** and **iPhone 15 Safari** (WebKit). In total: 25 UI cases × 2 browsers + 7 API cases.

## Run it

```bash
npm install
npx playwright install chromium webkit

npm test              # everything
npm run test:smoke    # the fastest P1 checks
npm run test:ui       # UI only (Chrome + iPhone)
npm run test:api      # API only
npm run test:a11y     # accessibility only
npm run test:headed   # watch it run in a visible browser
npm run screenshots   # refresh the bug screenshots in docs/bugs/
npm run report        # open the HTML report
```

On failure, Playwright keeps a screenshot and a trace (a step-by-step replay) in `test-results/`.

## How it is organised

```
pages/               page objects: LoginPage, InventoryPage, CheckoutPage
tests/setup/         logs in once and saves the session for the other tests
tests/ui/            login, product list, checkout, accessibility, known bugs
tests/api/           booking API, full create → delete flow
TEST-PLAN.md         scope, risk ranking, 21 test cases (automated + manual)
BUGS.md              5 bug reports with screenshots
.github/workflows/   runs the suite on every push and publishes the report
```

## Decisions worth noting

- **Log in once, reuse the session.** A setup step logs in and saves the session, so product and checkout tests start where they need to be. Faster runs, and a login problem shows up in one place.
- **Known bugs stay in the suite** as `test.fail()` checks that describe the *correct* behaviour. The run stays green while the bug exists and turns red the day it is fixed.
- **Waits are on real state** (for example "6 products visible"), never fixed sleeps. An empty page can never make a sort check pass by accident.
- **Locators** use roles, placeholders and `data-test` attributes, not CSS paths, so styling changes do not break tests.
- **Tags** (`@smoke`, `@regression`, `@a11y`, `@known-bug`) let CI or a person run just the slice they need.

---

Made by **Sabbir Hossain**, Software QA Engineer · [Portfolio](https://sabbir-portfolio-qa.vercel.app/) · [LinkedIn](https://www.linkedin.com/in/sabbir88)
