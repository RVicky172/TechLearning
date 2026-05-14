import type { TopicNode } from "@/data/types";

export const testingE2E: TopicNode = {
  id: "testing-e2e",
  title: "E2E Testing (Playwright & Cypress)",
  iconName: "Eye",
  theoryDetail: {
    keyConcepts: [
      "Playwright: cross-browser testing, multiple contexts, fast execution",
      "Cypress: developer-friendly, time travel debugging, built-in waiting",
      "E2E tests run against real browser; test real workflows end-to-end",
      "Selectors: query by role/label (accessible), data-testid (specific)",
      "Waiting strategies: Playwright auto-waits; Cypress has smart retries",
      "Screenshots and videos: capture failures for debugging",
    ],
    whyItMatters:
      "E2E tests catch issues that unit/integration tests miss. They test real user workflows and integrations with the actual backend.",
    commonPitfalls: [
      "Too many E2E tests; they're slow and brittle—use sparingly for critical paths",
      "Hard-coded waits instead of smart waiting; tests become flaky",
      "Testing internal implementation; query by user-visible elements",
      "Not cleaning up test data; tests affect each other",
    ],
    examples: [
      {
        title: "Playwright E2E Test",
        description: "Test user workflow with multiple steps.",
        code: `// tests/checkout.spec.ts
import { test, expect } from '@playwright/test';

test('user can complete checkout', async ({ page }) => {
  // Navigate to store
  await page.goto('http://localhost:3000');

  // Add product to cart
  await page.click('text=Add to Cart');
  expect(await page.getByText('Cart (1)')).toBeVisible();

  // Go to checkout
  await page.click('text=Checkout');
  expect(page.url()).toContain('/checkout');

  // Fill form
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="address"]', '123 Main St');

  // Submit
  await page.click('button:has-text("Place Order")');

  // Verify success
  await expect(page).toHaveURL(/\\/order\\/(\\d+)/);
  await expect(page.getByText('Order confirmed')).toBeVisible();
});`,
        language: "typescript",
      },
      {
        title: "Cypress E2E Test",
        description: "Cypress syntax with better DX.",
        code: `// cypress/e2e/login.cy.ts
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  it('should login with valid credentials', () => {
    cy.get('input[type="email"]').type('user@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button:contains("Sign In")').click();

    cy.url().should('eq', 'http://localhost:3000/dashboard');
    cy.get('h1:contains("Welcome")').should('be.visible');
  });

  it('should show error on invalid credentials', () => {
    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpass');
    cy.get('button:contains("Sign In")').click();

    cy.get('.error-message').should('contain', 'Invalid credentials');
  });
});`,
        language: "typescript",
      },
    ],
  },
};
