// Setup script to create test users before running tests

export function setupTestUsers() {
  const users = require('../fixtures/users.json');
  
  // Register first test user
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
    failOnStatusCode: false // Don't fail if user already exists
  });

  // Register second test user
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/users`,
    body: {
      user: {
        email: users.secondUser.email,
        username: users.secondUser.username,
        password: users.secondUser.password
      }
    },
    failOnStatusCode: false // Don't fail if user already exists
  });
}
