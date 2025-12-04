describe('User Login', () => {
  before(() => {
    // Register test users before running tests
    cy.fixture('users').then((users) => {
      // Register first test user (ignore if already exists)
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/users`,
        body: {
          user: {
            email: users.testUser.email,
            username: users.testUser.username,
            password: users.testUser.password
          }
        },
        failOnStatusCode: false
      });
    });
  });

  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.contains('Sign in').should('be.visible');
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
  });

  it('should successfully login with valid credentials', () => {
    cy.fixture('users').then((users) => {
      cy.get('input[placeholder="Email"]').type(users.testUser.email);
      cy.get('input[placeholder="Password"]').type(users.testUser.password);
      cy.get('button[type="submit"]').click();

      // Wait for redirect and check URL
      cy.url().should('include', '/');
      
      // Should show user's name in header
      cy.contains(users.testUser.username, { timeout: 10000 }).should('be.visible');
    });
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[placeholder="Email"]').type('wrong@example.com');
    cy.get('input[placeholder="Password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Should show error (check for any error text)
    cy.get('.error-messages, .errors-container, ul.error-messages', { timeout: 10000 }).should('be.visible');

    // Should remain on login page
    cy.url().should('include', '/login');
  });

  it('should persist login after page refresh', () => {
    cy.fixture('users').then((users) => {
      cy.get('input[placeholder="Email"]').type(users.testUser.email);
      cy.get('input[placeholder="Password"]').type(users.testUser.password);
      cy.get('button[type="submit"]').click();

      // Wait for successful login (URL should change from /login)
      cy.url().should('not.include', '/login');

      // Refresh page
      cy.reload();

      // User should still be logged in
      cy.contains(users.testUser.username, { timeout: 10000 }).should('be.visible');
    });
  });

  it('should logout successfully', () => {
    cy.fixture('users').then((users) => {
      // Login using the form (not API command)
      cy.get('input[placeholder="Email"]').type(users.testUser.email);
      cy.get('input[placeholder="Password"]').type(users.testUser.password);
      cy.get('button[type="submit"]').click();

      // Wait for login to complete
      cy.contains(users.testUser.username, { timeout: 10000 }).should('be.visible');

      // Click Settings
      cy.contains('Settings').click();
      
      // Click logout
      cy.contains('click here to logout', { matchCase: false }).click();

      // Should redirect to home and show sign in link
      cy.contains('Sign in', { timeout: 10000 }).should('be.visible');
    });
  });
});
