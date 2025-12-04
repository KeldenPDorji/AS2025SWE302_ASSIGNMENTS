// ***********************************************
// Custom commands for Conduit E2E testing
// ***********************************************

// Login command
Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/users/login`,
    body: {
      user: { email, password }
    }
  }).then((response) => {
    window.localStorage.setItem('jwt', response.body.user.token);
  });
});

// Register command
Cypress.Commands.add('register', (email, username, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/users`,
    body: {
      user: { email, username, password }
    },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 201 || response.status === 200) {
      window.localStorage.setItem('jwt', response.body.user.token);
    }
    // If user already exists (422), silently continue
  });
});

// Logout command
Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('jwt');
});

// Create article command
Cypress.Commands.add('createArticle', (articleData) => {
  const token = window.localStorage.getItem('jwt');
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/articles`,
    headers: {
      'Authorization': `Token ${token}`
    },
    body: {
      article: articleData
    }
  }).then((response) => {
    return response.body.article;
  });
});
