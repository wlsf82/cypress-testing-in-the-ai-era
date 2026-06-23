# Test Gap Analysis — Emoji Mart

**Sources compared**

- Requirements: [docs/README.md](../README.md)
- Existing suite: [cypress/e2e/emojiMart.cy.ts](../../cypress/e2e/emojiMart.cy.ts)

**Purpose:** A prioritized, ready-to-consume backlog of missing tests. Each gap below is written as a concrete test for the `cypress-author` skill to implement. Selectors are intentionally described by behavior/visible text rather than hard-coded — the author should discover the real selectors from the app and prefer `data-testid`/role/text over brittle class hooks (the existing suite leans on classes like `.lucide-shopping-cart`, `.lucide-trash2`, `.lucide-circle-plus`, which are fragile and should not be copied blindly).

---

## Coverage summary

| Requirement area | Requirement | Status |
| --- | --- | --- |
| Homepage | Display emojis | ✅ Covered |
| Homepage | Search bar visible | ✅ Covered |
| Homepage | Cards show title, description, price, Add to Cart button | ⚠️ Partial (only count + visibility) |
| Emoji Details | Click emoji → details page with info | ❌ Missing (click happens, no detail assertions) |
| Emoji Details | Add to Cart from details page | ⚠️ Partial (exercised, not asserted as a detail-page path) |
| Emoji Details | Back to all emojis button | ❌ Missing |
| Search | Search by name | ✅ Covered |
| Search | Case-insensitive search | ❌ Missing |
| Search | Real-time results | ✅ Covered |
| Search | Empty state ("No emojis found") | ❌ Missing |
| Cart | Add to cart | ✅ Covered |
| Cart | View cart | ✅ Covered |
| Cart | Close cart | ❌ Missing |
| Cart | Increase quantity | ✅ Covered |
| Cart | Decrease quantity | ❌ Missing |
| Cart | Remove from cart | ✅ Covered |
| Cart | Cart persistence after refresh | ❌ Missing |
| Cart | Proceed to checkout | ❌ Missing |
| Checkout | Contact info (email + full name) | ❌ Missing |
| Checkout | Email format validation | ❌ Missing |
| Checkout | Shipping address (street, city, country) | ❌ Missing |
| Checkout | Payment info (card number, expiry, CVV) | ❌ Missing |
| Checkout | Total amount visible | ❌ Missing |
| Checkout | Back to store button | ❌ Missing |
| Checkout | Complete Purchase button | ❌ Missing |
| Thank You | Heading | ❌ Missing |
| Thank You | Explanatory paragraph | ❌ Missing |
| Thank You | Random order number | ❌ Missing |
| Thank You | Back to Store button | ❌ Missing |
| UX | Responsive design | ❌ Missing |

**Scorecard:** 6 covered, 2 partial, 21 missing.

---

## P0 — Critical (core purchase flow is entirely untested)

The whole checkout → thank-you journey, the search empty state, and cart persistence have zero coverage. These represent the app's primary value and highest regression risk.

### P0.1 — Complete the full checkout happy path
- **Requirement:** Cart → Cart Checkout; Checkout (contact, shipping, payment, total, Complete Purchase).
- **Behavior:** A user with an item in the cart can fill every checkout section and complete the purchase.
- **Steps:**
  - Arrange: add an emoji to the cart and open the cart.
  - Act: proceed to checkout; fill contact (valid email + full name), shipping (street, city, country), payment (card number, expiry, CVV); click **Complete Purchase**.
  - Assert: the Thank You page is shown (hand off page-content assertions to P0.3).
- **Notes:** This is the backbone test; consider a reusable command/helper for filling the form since P0.2, P1.x reuse it.

### P0.2 — Total amount is visible before completing checkout
- **Requirement:** Checkout → Total amount.
- **Behavior:** The checkout page shows the total the user is about to pay.
- **Steps:** Add a known emoji to cart → go to checkout → assert a total amount is visible and reflects the cart contents (at minimum: visible and non-empty; ideally matches the item price).

### P0.3 — Thank You page content after purchase
- **Requirement:** Thank You Page → Heading, Explanatory paragraph, Order Number.
- **Behavior:** After completing a purchase the confirmation page shows the expected copy and an order number.
- **Steps:** Complete a purchase (reuse P0.1 flow) and assert:
  - Heading text `Thank You for Your Purchase!` is visible.
  - Paragraph `Your order has been successfully placed. We've sent a confirmation email with your order details.` is visible.
  - An order number is visible (assert it exists/non-empty; randomness verified in P2.2).

### P0.4 — Search empty state
- **Requirement:** Search → Empty State.
- **Behavior:** Searching a term that matches nothing shows an empty state instead of an empty list.
- **Steps:** Type a no-match term (e.g. `zzzzz`) → assert no emoji cards are rendered, a `No emojis found` heading is visible, and a message referencing the searched term is shown.

### P0.5 — Cart persists after page refresh
- **Requirement:** Cart → Cart Persistence.
- **Behavior:** Cart contents survive a reload.
- **Steps:** Add an emoji → reload the page (`cy.reload()`) → open the cart → assert the item is still present with the correct quantity.

### P0.6 — Proceed to checkout from the cart
- **Requirement:** Cart → Cart Checkout.
- **Behavior:** A user can navigate from the cart view into the checkout flow.
- **Steps:** Add an emoji → open cart → click the checkout action → assert the checkout page/form is displayed. (Can be a focused test even though P0.1 traverses the same step.)

---

## P1 — Important (visible features, partial or missing coverage)

### P1.1 — Email format validation at checkout
- **Requirement:** Checkout → Email (needs valid email format).
- **Behavior:** An invalid email blocks completion / surfaces a validation error.
- **Steps:** Reach checkout → enter an invalid email (e.g. `not-an-email`) plus otherwise-valid data → attempt to complete → assert the purchase does NOT complete and a validation message/blocked state is shown. Pair with a valid-email control path (covered by P0.1).

### P1.2 — Emoji details page shows emoji information
- **Requirement:** Emoji Details → Emoji Information.
- **Behavior:** Clicking an emoji card navigates to a details page that displays that emoji's information.
- **Steps:** Click a known emoji card → assert the details page shows the emoji's title, description, and price (the existing add-to-cart test clicks through here but asserts nothing about the detail view).

### P1.3 — Add to Cart from the details page
- **Requirement:** Emoji Details → Add to Cart.
- **Behavior:** The Add to Cart action works specifically from the details page.
- **Steps:** Open an emoji's details page → click **Add to Cart** → open cart → assert the item is present. Frame the test title around the details-page path to distinguish it from a list-level add.

### P1.4 — Back to all emojis from the details page
- **Requirement:** Emoji Details → Back to all emojis.
- **Behavior:** The Back to all emojis button returns the user to the list.
- **Steps:** Open an emoji's details page → click **Back to all emojis** → assert the homepage list (6 cards) is shown again.

### P1.5 — Case-insensitive search
- **Requirement:** Search → Search by Name (not case-sensitive).
- **Behavior:** Lowercase and mixed-case queries find the same emoji.
- **Steps:** Type `rocket` (lowercase) → assert the 🚀 card is the single result. Complements the existing `Rocket` test; consider parameterizing over `['Rocket', 'rocket', 'ROCKET']`.

### P1.6 — Close the cart
- **Requirement:** Cart → Close Cart.
- **Behavior:** The cart view can be dismissed.
- **Steps:** Add an emoji → open cart → click the close control → assert the cart view is no longer visible.

### P1.7 — Decrease quantity in the cart
- **Requirement:** Cart → Update Quantity (decrease).
- **Behavior:** A user can lower an item's quantity. The existing suite only covers increase.
- **Steps:** Add an emoji → open cart → increase to 2 → decrease → assert the counter shows `1`. Optionally assert decreasing at quantity 1 removes the item or is disabled (confirm actual behavior, do not assume).

### P1.8 — Emoji cards show full content
- **Requirement:** Homepage → Emoji List (title, description, price, Add to Cart button per card).
- **Behavior:** Each card renders its title, description, price, and an Add to Cart button. The existing homepage test only checks count and visibility.
- **Steps:** On the homepage, for each card assert a non-empty title, description, price, and a visible Add to Cart button.

### P1.9 — Back to store from checkout
- **Requirement:** Checkout → Back to store.
- **Behavior:** Before completing, the user can return to the store via Back to store.
- **Steps:** Reach checkout → click **Back to store** → assert the homepage/store is shown and (ideally) the cart still holds its items.

---

## P2 — Lower priority (cross-cutting / lower regression risk)

### P2.1 — Responsive design
- **Requirement:** User Experience → Responsive Design.
- **Behavior:** The app renders usably across screen sizes.
- **Steps:** Use `cy.viewport()` for a mobile and a desktop size and assert key elements (header, search bar, emoji cards, cart access) remain visible/usable in each. Keep assertions about presence/visibility rather than pixel-perfect layout.

### P2.2 — Order number is random per purchase
- **Requirement:** Thank You Page → Order Number (random for each purchase).
- **Behavior:** Two separate purchases yield different order numbers.
- **Steps:** Complete a purchase, capture the order number; repeat from a fresh state; assert the two order numbers differ. (Build on P0.3.)

### P2.3 — Back to Store from the Thank You page
- **Requirement:** Thank You Page → Back to Store button.
- **Behavior:** From the confirmation page the user returns to the store.
- **Steps:** Complete a purchase → click **Back to Store** → assert the homepage list is shown (and the cart is empty after a completed order, if that is the real behavior — verify, don't assume).

---

## Implementation notes for `cypress-author`

- **Reduce duplication:** P0.1, P0.2, P0.3, P1.1, P1.9, P2.x all need an item in the cart and/or a filled checkout form. Extract `addEmojiToCart()` and `fillCheckoutForm()` helpers (custom commands or local functions) so each test stays focused on its own assertion.
- **Prefer resilient selectors:** The existing suite couples to Lucide icon classes (`.lucide-shopping-cart`, `.lucide-trash2`, `.lucide-circle-plus`). For new tests prefer `data-testid`, accessible roles, or visible text; flag the icon-class selectors for follow-up hardening.
- **Assert outcomes, not just actions:** Several existing tests click through screens (e.g. the emoji details page) without asserting what those screens render — new tests should always assert the resulting state.
- **Confirm edge behaviors before encoding them:** decrease-at-1, post-purchase cart state, and validation messaging should be observed in the running app rather than assumed.

---

**Thank you for using Cypress!**
