describe('Complete User Journeys', () => {
  it('should complete new user registration and article creation flow', () => {
    const timestamp = Date.now();
    const username = `newuser${timestamp}`;
    const email = `newuser${timestamp}@example.com`;
    const articleTitle = `My First Article ${timestamp}`;

    // 1. Register
    cy.visit('/register');
    cy.get('input[placeholder="Username"]').type(username);
    cy.get('input[placeholder="Email"]').type(email);
    cy.get('input[placeholder="Password"]').type('Password123!');
    cy.get('button[type="submit"]').click();

    // 2. Should be logged in
    cy.url().should('eq', `${Cypress.config().baseUrl}/`, { timeout: 10000 });

    // 3. Navigate to editor
    cy.visit('/editor');

    // 4. Create article
    cy.get('input[placeholder="Article Title"]').type(articleTitle);
    cy.get('input[placeholder="What\'s this article about?"]').type('Learning Cypress');
    cy.get('textarea[placeholder="Write your article (in markdown)"]').type('This is my first article!');
    cy.get('input[placeholder="Enter tags"]').type('first{enter}');
    cy.contains('button', 'Publish Article').click();

    // 5. Article should be published
    cy.url().should('include', '/article/', { timeout: 10000 });
    cy.wait(1000);
    cy.contains('h1', articleTitle, { timeout: 10000 }).should('be.visible');

    // 6. Go to profile
    cy.visit(`/@${username}`);

    // 7. Article should appear in profile
    cy.contains(articleTitle, { timeout: 10000 }).should('be.visible');
  });

  it('should complete article interaction flow', () => {
    cy.fixture('users').then((users) => {
      // Login and create an article
      cy.login(users.testUser.email, users.testUser.password);
      
      const timestamp = Date.now();
      const articleTitle = `Workflow Article ${timestamp}`;
      
      cy.createArticle(articleTitle, 'Description', 'Body content here', ['workflow']).then((response) => {
        const slug = response.body.article.slug;
        
        // Visit the article (as the author)
        cy.visit(`/article/${slug}`);
        cy.wait(2000);

        // Verify article is visible
        cy.contains(articleTitle).should('be.visible');

        // Navigate to home to see the article in feed
        cy.visit('/');
        cy.wait(1000);
        
        // Should see articles in the feed
        cy.get('.article-preview').should('have.length.at.least', 1);

        // View own profile
        cy.visit(`/@${users.testUser.username}`);
        cy.wait(1000);

        // Should be on profile page
        cy.url().should('include', `/@${users.testUser.username}`);
      });
    });
  });

  it('should complete settings update flow', () => {
    cy.fixture('users').then((users) => {
      cy.login(users.testUser.email, users.testUser.password);
      cy.visit('/settings');
      cy.wait(1000);

      // Update profile
      cy.get('textarea[placeholder="Short bio about you"]').clear().type('E2E Testing Expert');
      cy.contains('button', 'Update Settings').click();

      // Wait for any redirect/update
      cy.wait(3000);
      
      // Navigate to settings again to verify the change persisted
      cy.visit('/settings');
      cy.wait(1000);
      
      // Verify bio is saved in settings
      cy.get('textarea[placeholder="Short bio about you"]').should('have.value', 'E2E Testing Expert');
    });
  });
});
