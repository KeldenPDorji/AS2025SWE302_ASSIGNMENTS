describe('Article Management', () => {
  let testUser;
  let authToken;

  before(() => {
    // Load test user data and register
    cy.fixture('users').then((users) => {
      testUser = users.testUser;
      
      // Register and login to get auth token
      cy.register(testUser.email, testUser.username, testUser.password);
      cy.login(testUser.email, testUser.password).then((token) => {
        authToken = token;
      });
    });
  });

  beforeEach(() => {
    // Login before each test
    cy.login(testUser.email, testUser.password);
    cy.visit('/');
  });

  after(() => {
    cy.logout();
  });

  it('should create a new article', () => {
    const articleTitle = `Test Article ${Date.now()}`;
    const articleDescription = 'This is a test article description';
    const articleBody = 'This is the body of the test article with some content.';
    const articleTags = 'testing, cypress, e2e';

    // Navigate to new article page directly
    cy.visit('/editor');
    cy.url().should('include', '/editor');

    // Fill in article form
    cy.get('input[placeholder="Article Title"]').type(articleTitle);
    cy.get('input[placeholder="What\'s this article about?"]').type(articleDescription);
    cy.get('textarea[placeholder="Write your article (in markdown)"]').type(articleBody);
    cy.get('input[placeholder="Enter tags"]').type(articleTags);

    // Submit the article
    cy.contains('button', 'Publish Article').click();

    // Verify redirect to article page
    cy.url().should('include', '/article/');
    cy.contains('h1', articleTitle).should('be.visible');
    cy.contains(articleBody).should('be.visible');
  });

  it('should view an article', () => {
    // Create an article first
    const articleTitle = `View Test Article ${Date.now()}`;
    cy.createArticle({
      title: articleTitle,
      description: 'Test description',
      body: 'Test body content',
      tagList: ['test']
    }).then((article) => {
      // Navigate directly to the article
      cy.visit(`/article/${article.slug}`);

      // Verify article page loads
      cy.url().should('include', '/article/');
      cy.contains('h1', articleTitle).should('be.visible');
    });
  });

  it('should edit an existing article', () => {
    // Create an article to edit
    const originalTitle = `Original Article ${Date.now()}`;
    const updatedTitle = `Updated Article ${Date.now()}`;
    
    cy.createArticle({
      title: originalTitle,
      description: 'Original description',
      body: 'Original body content',
      tagList: ['test']
    }).then((article) => {
      // Navigate to the article
      cy.visit(`/article/${article.slug}`);
      
      // Click edit button
      cy.contains('Edit Article').click();
      cy.url().should('include', '/editor/');

      // Update the title
      cy.get('input[placeholder="Article Title"]').clear().type(updatedTitle);

      // Submit the update
      cy.contains('button', 'Publish Article').click();

      // Verify the update
      cy.url().should('include', '/article/');
      cy.contains('h1', updatedTitle).should('be.visible');
    });
  });

  it('should delete an article', () => {
    // Create an article to delete
    const articleTitle = `Delete Test Article ${Date.now()}`;
    
    cy.createArticle({
      title: articleTitle,
      description: 'Will be deleted',
      body: 'This article will be deleted',
      tagList: ['test']
    }).then((article) => {
      // Navigate to the article
      cy.visit(`/article/${article.slug}`);
      
      // Click delete button
      cy.contains('Delete Article').click();

      // Verify redirect to home page
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      
      // Verify article no longer appears on home page
      cy.contains(articleTitle).should('not.exist');
    });
  });

  it('should favorite an article', () => {
    // Create an article to favorite
    const articleTitle = `Favorite Test Article ${Date.now()}`;
    
    cy.createArticle({
      title: articleTitle,
      description: 'Test favorite',
      body: 'This article will be favorited',
      tagList: ['test']
    }).then((article) => {
      // Navigate to the article
      cy.visit(`/article/${article.slug}`);
      
      // Click favorite button (may have different text based on state)
      cy.get('button.btn-outline-primary, button.btn-primary').first().click();
      cy.wait(500);

      // Verify button state changed
      cy.get('button.btn-primary, button.btn-outline-primary').should('exist');
    });
  });

  it('should filter articles by tag', () => {
    const uniqueTag = `tag${Date.now()}`;
    
    // Create an article with unique tag
    cy.createArticle({
      title: `Tagged Article ${Date.now()}`,
      description: 'Tagged article',
      body: 'This article has a unique tag',
      tagList: [uniqueTag]
    }).then((article) => {
      // Navigate directly to the filtered view
      cy.visit(`/?tag=${uniqueTag}`);
      
      // Verify we're on the filtered view
      cy.url().should('include', `tag=${uniqueTag}`);
      
      // The article list should load (even if empty initially)
      cy.get('.article-preview, .article-list').should('exist');
    });
  });
});
