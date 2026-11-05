# Test plan

## Scope
- **SauceDemo** web store: login, product list, cart, checkout, accessibility. Desktop Chrome and iPhone 15 Safari.
- **Restful Booker** API: authentication and the full booking lifecycle.
- **Out of scope:** real payments, load and performance, Firefox, the product detail page (not yet covered, see P3).

## How cases are prioritised
Risk = how likely it breaks × how much it hurts a user or the business.

| Priority | Meaning | When it runs |
|---|---|---|
| **P1** | Blocks login, buying, or data safety | Every push (`@smoke` for the fastest subset) |
| **P2** | Wrong result, but there is a workaround | Every push (`@regression`) |
| **P3** | Polish, rare paths, needs a human eye | Manual pass before a release |

## Test cases

| ID | Priority | Case | Expected result | How |
|---|---|---|---|---|
| TC-01 | P1 | Log in with a valid account | Product list opens | Auto `@smoke` · [login](tests/ui/login.spec.ts) |
| TC-02 | P1 | Log in with a locked account | Blocked with "locked out" message | Auto · [login](tests/ui/login.spec.ts) |
| TC-03 | P1 | Open the product page without logging in | Sent back to login with an error | Auto · [login](tests/ui/login.spec.ts) |
| TC-04 | P1 | Buy two products end to end | Total = subtotal + tax; confirmation shown; cart empty | Auto `@smoke` · [checkout](tests/ui/checkout.spec.ts) |
| TC-05 | P1 | Leave First Name, Last Name or Postal Code empty | Checkout stops with the matching error | Auto (3 cases) · [checkout](tests/ui/checkout.spec.ts) |
| TC-06 | P1 | Add and remove products | Cart badge always shows the right count | Auto `@smoke` · [product list](tests/ui/inventory.spec.ts) |
| TC-07 | P1 | API: create a booking, then read it | 200, same data comes back | Auto `@smoke` · [booking API](tests/api/booking.spec.ts) |
| TC-08 | P1 | API: change a booking without a token | 403, nothing changes | Auto · [booking API](tests/api/booking.spec.ts) |
| TC-09 | P2 | Log in with a wrong password | Generic error that does not reveal which field is wrong | Auto · [login](tests/ui/login.spec.ts) |
| TC-10 | P2 | Log in with an empty username or password | Field-specific "is required" error | Auto · [login](tests/ui/login.spec.ts) |
| TC-11 | P2 | Sort by price, both directions | Prices in the right order | Auto · [product list](tests/ui/inventory.spec.ts) |
| TC-12 | P2 | Sort by name Z to A | Names in reverse order | Auto · [product list](tests/ui/inventory.spec.ts) |
| TC-13 | P2 | Reload the page with items in the cart | Cart is kept | Auto · [product list](tests/ui/inventory.spec.ts) |
| TC-14 | P2 | Accessibility scan of login, product list, checkout | No WCAG 2.1 AA violations | Auto `@a11y` · [accessibility](tests/ui/accessibility.spec.ts) |
| TC-15 | P2 | Log in with the keyboard only | Tab and Enter are enough to log in | Auto `@a11y` · [accessibility](tests/ui/accessibility.spec.ts) |
| TC-16 | P2 | API: log in with wrong credentials | No token, "Bad credentials" | Auto · [booking API](tests/api/booking.spec.ts) |
| TC-17 | P2 | API: partial update, then delete | Field changes; after delete GET returns 404 | Auto · [booking API](tests/api/booking.spec.ts) |
| TC-18 | P3 | Use the store at 320 px width | No sideways scrolling, buttons reachable | Manual |
| TC-19 | P3 | Use login and checkout with VoiceOver | Fields and errors are read out | Manual |
| TC-20 | P3 | Log out, then press Back | Product list is not shown again | Manual |
| TC-21 | P3 | Product detail page | Name and price match the list | Manual |

## Known bugs
Five bugs on the `problem_user` and `error_user` accounts are reported in [BUGS.md](BUGS.md) and guarded by [known-bugs.spec.ts](tests/ui/known-bugs.spec.ts).

## Done means
- All P1 and P2 automated cases pass on Chrome and iPhone Safari.
- Every failure has a bug report with steps, expected, actual, and a screenshot.
- P3 manual cases are checked before a release, and anything found is added to BUGS.md.
