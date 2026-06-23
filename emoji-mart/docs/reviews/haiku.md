# Cypress Test Review: Emoji Mart App

## Test-by-Test Breakdown

### ✅ Test 1: "displays the homepage with a list of emojis"
**What it verifies:** Homepage loads with the correct title, search input field, and 6 emoji cards are visible.

**Good practice:** Uses `data-testid` selector (`[data-testid="emoji-card"]`), which decouples the test from UI implementation details. This is **excellent**.

**Issues:**
- Hardcoded expectation: `should('have.length', 6)` assumes exactly 6 emojis with no verification in the app code
- Missing assertion: Doesn't verify the search input is actually functional (could be readonly)

---

### ⚠️ Test 2: "filters emojis based on search input"
**What it verifies:** Typing into the search field filters the emoji list to show only matching results (Rocket).

**Issue — Brittle selector:**
```typescript
cy.get('input[placeholder="Search emojis..."]').type('Rocket');
```
This selector is **fragile**. If the placeholder text changes (e.g., "Search..." or "Find emojis"), the test breaks. Per [Cypress best practices on selectors](https://docs.cypress.io/guides/references/best-practices#Selecting-elements), use `data-testid` instead:
```typescript
cy.get('[data-testid="search-input"]').type('Rocket');
```

**Test isolation issue:** This test may fail if test #2 runs before it in the suite (emoji still filtered from previous test). The `beforeEach` should reset app state, not just revisit the page.

---

### ⚠️ Test 3: "adds an emoji to the cart"
**What it verifies:** Clicking an emoji, adding it to cart, and opening the cart shows the item.

**Issues:**

1. **Brittle selectors:**
   - `cy.get('.lucide-shopping-cart').click()` — Depends on [Lucide](https://lucide.dev) icon library CSS class names, which can change during library updates.
   - **Recommendation:** Use `data-testid="cart-button"` instead.

2. **Act/Assert sections mixed:**
   ```typescript
   // Act
   cy.get('[data-testid="emoji-card"]').contains('😊').click();
   cy.contains('button', 'Add to Cart').click();
   cy.get('.lucide-shopping-cart').click()

   // Assert — Too late! Should be before this comment
   cy.get('[data-testid="cart-item"]')...
   ```
   According to [Cypress AAA pattern](https://docs.cypress.io/guides/references/best-practices#Testing-the-happy-path), keep all Acts before Asserts. The cart-open click should be earlier.

3. **Missing assertion:** Doesn't verify the cart button updates (e.g., badge showing "1 item").

---

### ⚠️ Test 4: "removes an emoji from the cart"
**What it verifies:** After adding an emoji, clicking the trash icon removes it and shows "Your cart is empty."

**Issues:**

1. **Brittle selector:**
   ```typescript
   cy.get('button svg.lucide-trash2').click();
   ```
   Couples the test to the icon library. Use `data-testid="delete-button"` or `data-testid="remove-item"` instead.

2. **Test logic error:** Assert appears *before* the Act:
   ```typescript
   // Assert (lines 49-52) — happens BEFORE delete!
   cy.get('[data-testid="cart-item"]').contains('😊').should('be.visible');

   // Act (line 55)
   cy.get('button svg.lucide-trash2').click();

   // Assert (lines 58-60)
   cy.get('[data-testid="empty-cart"]')...
   ```
   Reorder so the deletion happens after verifying the item exists, then verify it's gone.

3. **Missing isolation:** Assumes previous test added the emoji. Emoji Mart state should not depend on test execution order. Each test should independently set up its own state.

---

### ⚠️ Test 5: "updates the quantity of an emoji in the cart"
**What it verifies:** Clicking a plus icon increments the cart item quantity to 2.

**Issues:**

1. **Brittle selector:**
   ```typescript
   cy.get('button svg.lucide-circle-plus').click();
   ```
   Use `data-testid="increment-button"` instead.

2. **Test state dependency:** Assumes previous tests ran and left state in a specific condition.

3. **Incomplete verification:** Doesn't assert that the price or total updates if applicable. Doesn't verify we can't go below 1 or above a max quantity.

---

## 🚩 Critical Issues Across All Tests

| Issue | Impact | Fix |
|-------|--------|-----|
| **Brittle icon selectors** (`.lucide-*`, `.lucide-trash2`, `.lucide-circle-plus`, `.lucide-shopping-cart`) | Tests break when icon library or implementation changes | Replace with `data-testid` attributes |
| **Placeholder text selector** (`input[placeholder="Search..."]`) | Tests fail if UX copy changes | Use `data-testid="search-input"` |
| **Test isolation failure** | Running tests in different order causes failures | Reset app state in each test or use `cy.reload()` |
| **AAA pattern misalignment** | Confusing test logic in tests 3, 4, 5 | Separate Arrange → Act → Assert blocks clearly |
| **No error states tested** | Unknown if invalid searches or cart limits work | Add negative test cases |

---

## 🎯 Suggested Improvements

**1. Replace all icon-based selectors with data-testid:**
```typescript
// ❌ Before
cy.get('.lucide-shopping-cart').click();

// ✅ After
cy.get('[data-testid="cart-icon"]').click();
```

**2. Fix test isolation with independent setup:**
Each test should build its own state without depending on others:
```typescript
it('removes an emoji from the cart', () => {
  // Arrange: independently add an emoji
  cy.get('[data-testid="emoji-card"]').contains('😊').click();
  cy.contains('button', 'Add to Cart').click();
  cy.get('[data-testid="cart-icon"]').click();
  cy.get('[data-testid="cart-item"]').contains('😊').should('be.visible');

  // Act: delete it
  cy.get('[data-testid="delete-button"]').click();

  // Assert: verify empty state
  cy.get('[data-testid="empty-cart"]').contains('Your cart is empty').should('be.visible');
});
```

**3. Add data-driven test for initial emoji count:**
```typescript
it('displays the homepage with a list of emojis', () => {
  cy.get('[data-testid="emoji-card"]')
    .should('have.length.greaterThan', 0) // Don't hardcode
    .and('be.visible');
});
```

---

## ✨ Strengths to Celebrate

1. **Excellent use of `data-testid`** on core elements (emoji-card, cart-item, empty-cart) — this is the gold standard for maintainability
2. **Clear, descriptive test names** — anyone reading the suite understands the feature scope
3. **`beforeEach` centralization** — reduces setup duplication
4. **Attempt at AAA pattern** — structure and intent are there, just needs refinement

**According to [Cypress best practices on test structure](https://docs.cypress.io/guides/references/best-practices#Testing-the-happy-path), you're on the right track—just need to eliminate icon library coupling and strengthen test isolation.**
