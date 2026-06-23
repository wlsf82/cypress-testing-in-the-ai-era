# Plan: Fix Failing EmojiCard Cart Test

## Context

A Cypress component test for `EmojiCard` is using `.dblclick()` to simulate clicking the "Add to Cart" button. The intent is to verify that one click adds one emoji to the cart. However, the test fails because the cart count reaches 2 instead of 1. This is a test-code bug — the wrong Cypress command was used.

---

## Root Cause (cypress-explain)

`dblclick()` follows standard browser behavior: it dispatches **two separate `click` events** before firing the `dblclick` event. Each `click` event independently triggers the button's `onClick` handler:

```tsx
onClick={(e) => {
  e.stopPropagation();
  addToCart(emoji);   // ← called TWICE by dblclick
}}
```

So after `.dblclick()`, `addToCart` is called twice → cart total = **2**, but the test asserts **1**.

---

## Documentation Backing (cypress-docs)

From the official Cypress `dblclick` documentation:

> "A double-click fires two separate `click` events (one for each physical click), plus a `dblclick` event."

Key difference from `.click()`:

- `.click()` → fires **one** click event → `addToCart` called once → cart total = 1 ✓
- `.dblclick()` → fires **two** click events → `addToCart` called twice → cart total = 2 ✗

---

## Fix

**File:** [emoji-mart/src/components/EmojiCard.cy.tsx](../../src/components/EmojiCard.cy.tsx)

Change the line in the failing test from:

```ts
cy.contains('button', 'Add to Cart').dblclick();
```

to:

```ts
cy.contains('button', 'Add to Cart').click();
```

No changes needed to the component `EmojiCard.tsx` — the component behavior (`e.stopPropagation()`, `addToCart`) is correct.

---

## Verification

After applying the fix, run the component tests:

```sh
cd emoji-mart && npx cypress run --component --spec "src/components/EmojiCard.cy.tsx"
```

All four tests should pass:

1. `renders the emoji details and price` ✓
2. `clicking the card body → invokes the onClick callback` ✓
3. `clicking "Add to Cart" → adds the emoji to the cart without triggering onClick` ✓ (was failing)
4. `clicking "Add to Cart" twice → increases the quantity of the same emoji` ✓
