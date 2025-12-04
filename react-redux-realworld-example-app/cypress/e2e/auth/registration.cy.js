describe('User Registration', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display registration form', () => {
    cy.contains('Sign up').should('be.visible');
    cy.get('input[placeholder="Username"]').should('be.visible');
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
  });

  it('should successfully register a new user', () => {
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `testuser${timestamp}@example.com`;

    cy.get('input[placeholder="Username"]').type(username);
    cy.get('input[placeholder="Email"]').type(email);
    cy.get('input[placeholder="Password"]').type('Password123!');
    cy.get('button[type="submit"]').click();

    // Should redirect to home page
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);

    // User should be logged in
    cy.contains(username).should('be.visible');
  });

  it('should show error for existing email', () => {
    // First, register a user
    const timestamp = Date.now();
    const existingEmail = `existing${timestamp}@example.com`;
    const existingUsername = `existing${timestamp}`;

    cy.get('input[placeholder="Username"]').type(existingUsername);
    cy.get('input[placeholder="Email"]').type(existingEmail);
    cy.get('input[placeholder="Password"]').type('Password123!');
    cy.get('button[type="submit"]').click();

    // Wait for registration
    cy.url().should('not.include', '/register');

    // Try to register again with same email
    cy.visit('/register');
    cy.get('input[placeholder="Username"]').type('differentusername');
    cy.get('input[placeholder="Email"]').type(existingEmail);
    cy.get('input[placeholder="Password"]').type('Password123!');
    cy.get('button[type="submit"]').click();

    // Should show error
    cy.get('.error-messages, .errors-container, ul.error-messages', { timeout: 10000 }).should('be.visible');
  });

  it('should validate required fields', () => {
    cy.get('button[type="submit"]').click();

    // Form should not submit and show validation
    cy.url().should('include', '/register');
  });

  it('should validate email format', () => {
    cy.get('input[placeholder="Username"]').type('testuser');
    cy.get('input[placeholder="Email"]').type('invalid-email');
    cy.get('input[placeholder="Password"]').type('Password123!');
    cy.get('button[type="submit"]').click();

    // Should show validation error
    cy.url().should('include', '/register');
  });
});
