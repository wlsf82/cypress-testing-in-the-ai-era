/// <reference types="cypress" />

describe('Emoji Mart App', () => {
  beforeEach(() => {
    // Arrange
    cy.visit('/');
  });

  it('displays the homepage with a list of emojis', () => {
    // Assert
    cy.contains('h1', 'EmojiMart').should('be.visible');
    cy.get('input[placeholder="Search emojis..."]').should('be.visible');
    cy.get('[data-testid="emoji-card"]')
      .should('have.length', 6) // Assuming there are 6 emojis
      .and('be.visible');
  });

  it('filters emojis based on search input', () => {
    // Act
    cy.get('input[placeholder="Search emojis..."]').type('Rocket');

    // Assert
    cy.get('[data-testid="emoji-card"]').should('have.length', 1);
    cy.get('[data-testid="emoji-card"]')
      .contains('🚀')
      .should('be.visible');
  });

  it('adds an emoji to the cart', () => {
    // Arrange
    cy.get('[data-testid="emoji-card"]').contains('😊').click();

    // Act
    cy.contains('button', 'Add to Cart').click();
    cy.get('.lucide-shopping-cart').click()

    // Assert
    cy.get('[data-testid="cart-item"]')
      .contains('😊')
      .should('be.visible');
  });

  it('removes an emoji from the cart', () => {
    // Arrange
    cy.get('[data-testid="emoji-card"]').contains('😊').click();
    cy.contains('button', 'Add to Cart').click();
    cy.get('.lucide-shopping-cart').click()

    // Assert
    cy.get('[data-testid="cart-item"]')
      .contains('😊')
      .should('be.visible');

    // Act
    cy.get('button svg.lucide-trash2').click();

    // Assert
    cy.get('[data-testid="empty-cart"]')
      .contains('Your cart is empty')
      .should('be.visible');
  });

  it('updates the quantity of an emoji in the cart', () => {
    // Arrange
    cy.get('[data-testid="emoji-card"]')
      .contains('😊')
      .click();
    cy.contains('button', 'Add to Cart').click();
    cy.get('.lucide-shopping-cart').click()

    // Assert
    cy.get('[data-testid="cart-item"]')
      .contains('😊')
      .should('be.visible');

    // Act
    cy.get('button svg.lucide-circle-plus').click();

    // Assert
    cy.get('[data-testid="cart-item-counter"]')
      .contains('2')
      .should('be.visible');
  });
});
