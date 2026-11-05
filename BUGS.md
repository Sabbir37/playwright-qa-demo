# Bug reports

Found while testing [SauceDemo](https://www.saucedemo.com), a practice store that has deliberate bugs on some test accounts. Each bug is guarded by a test in [`tests/ui/known-bugs.spec.ts`](tests/ui/known-bugs.spec.ts) marked as an expected failure. When a bug is fixed, that test "unexpectedly passes" and fails the run, which reminds us to close the bug.

Environment: Chrome (desktop) and Safari (iPhone 15 emulation), Playwright 1.64.

---

### BUG-01: Every product shows the same image
**Severity:** Medium (users cannot tell products apart by picture)
**Account:** `problem_user`

**Steps**
1. Log in as `problem_user` / `secret_sauce`.
2. Look at the product list.

**Expected:** each of the 6 products shows its own photo.
**Actual:** all 6 products show the same image (1 unique image for 6 products).

---

### BUG-02: Sorting by price does not change the order
**Severity:** Medium
**Account:** `problem_user`

**Steps**
1. Log in as `problem_user`.
2. Choose **Price (low to high)** in the sort menu.

**Expected:** prices go from lowest to highest: 7.99, 9.99, 15.99, 15.99, 29.99, 49.99.
**Actual:** order stays the same: 29.99, 9.99, 15.99, 49.99, 7.99, 15.99.

---

### BUG-03: Some "Add to cart" buttons do nothing
**Severity:** High (users cannot buy half of the products)
**Account:** `problem_user`

**Steps**
1. Log in as `problem_user`.
2. Click **Add to cart** on all 6 products.

**Expected:** cart badge shows 6.
**Actual:** cart badge shows 3. The other 3 buttons do not respond.

---

### BUG-04: Last Name field stays empty while typing
**Severity:** Critical (checkout cannot be completed)
**Account:** `problem_user`

**Steps**
1. Log in as `problem_user`, add any product, open the cart, click **Checkout**.
2. Type `Sabbir` in First Name, then `Hossain` in Last Name.

**Expected:** Last Name shows `Hossain`.
**Actual:** Last Name stays empty, so the form fails with "Last Name is required".

---

### BUG-05: "Finish" does not complete the order
**Severity:** Critical (payment flow is blocked)
**Account:** `error_user`

**Steps**
1. Log in as `error_user`, add **Sauce Labs Backpack**, open the cart, click **Checkout**.
2. Fill in First Name, Last Name and Postal Code, click **Continue**.
3. Click **Finish**.

**Expected:** "Thank you for your order!" confirmation page.
**Actual:** the page stays on the overview; no confirmation is shown.
