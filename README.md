# Playwright QA Demo

UI and API test automation with **Playwright + TypeScript**, written the way I test real products: risk first, clear names, page objects, and bugs reported so a developer can fix them without asking questions.

Targets are public practice apps, so anyone can clone and run this:
- **UI:** [SauceDemo](https://www.saucedemo.com), a demo online store
- **API:** [Restful Booker](https://restful-booker.herokuapp.com), a demo hotel booking API

## What is covered

| Area | Tests | What they check |
|---|---|---|
| Login | 6 | valid login, locked-out user, wrong password, empty fields, page protection without login |
| Product list | 6 | 6 products with prices, sort by price both ways, sort by name, cart badge, cart kept after reload |
| Checkout | 4 | full order with total = subtotal + tax, required First Name, Last Name and Postal Code |
| Known bugs | 5 | real bugs found on the `problem_user` and `error_user` accounts, written up in [BUGS.md](BUGS.md) |
| Booking API | 7 | auth token, bad credentials, create, read, update without token (403), partial update, delete then 404 |

UI tests run on **desktop Chrome** and **iPhone 15 Safari** (WebKit), so every UI case runs twice. Total: **49 tests**.

## Run it

```bash
npm install
npx playwright install chromium webkit
npm test              # everything
npm run test:ui       # UI only (Chrome + iPhone)
npm run test:api      # API only
npm run report        # open the HTML report
```

On failure, Playwright keeps a screenshot and a trace (step-by-step replay) in `test-results/`.

## How it is organised

```
pages/            page objects: LoginPage, InventoryPage, CheckoutPage
tests/ui/         login, product list, checkout, known bugs
tests/api/        booking API, full create → delete flow
BUGS.md           bug reports: steps, expected, actual, severity
.github/workflows CI: runs the suite on every push and pull request
```

## Decisions worth noting

- **Known bugs stay in the suite** as `test.fail()` checks that describe the *correct* behaviour. The run stays green while the bug exists, and turns red the day it is fixed, so nobody forgets to close it.
- **Waits are on real state** (e.g. "6 products visible") instead of fixed sleeps. An empty page can never make a sort check pass by accident.
- **Locators** use roles, placeholders and `data-test` attributes, not CSS paths, so styling changes do not break tests.

---

Made by **Sabbir Hossain**, Software QA Engineer · [Portfolio](https://sabbir-portfolio-qa.vercel.app/) · [LinkedIn](https://www.linkedin.com/in/sabbir88)
