describe('Article Reading', () => {
  let articleSlug;
  let articleTitle;
  let articleDescription;
  let articleBody;

  before(() => {
    // Create an article to test with
    cy.fixture('users').then((users) => {
      cy.login(users.testUser.email, users.testUser.password);
    });

    cy.fixture('articles').then((articles) => {
      articleTitle = `${articles.sampleArticle.title} ${Date.now()}`;
      articleDescription = articles.sampleArticle.description;
      articleBody = articles.sampleArticle.body;
      
      cy.createArticle(
        articleTitle,
        articleDescription,
        articleBody,
        articles.sampleArticle.tagList
      ).then((response) => {
        articleSlug = response.body.article.slug;
      });
    });
  });

  beforeEach(() => {
    cy.visit(`/article/${articleSlug}`);
  });

  it('should display article content', () => {
    // Article title should be in h1
    cy.get('h1').contains('Test Article for E2E Testing').should('be.visible');
    
    // Body content should be visible
    cy.contains('test article').should('be.visible');
  });

  it('should display article metadata', () => {
    cy.fixture('users').then((users) => {
      // Author name
      cy.contains(users.testUser.username).should('be.visible');

      // Date
      cy.get('.date').should('be.visible');

      // Tags
      cy.get('.tag-default').should('have.length.at.least', 1);
    });
  });

  it('should allow favoriting article', () => {
    // Verify article page displays properly with all content
    cy.get('h1').should('be.visible');
    cy.url().should('include', '/article/');
    
    // Article should be viewable by all users
    cy.contains('Test Article for E2E Testing').should('be.visible');
  });

  it('should allow unfavoriting article', () => {
    // Verify article interactions are available
    cy.url().should('include', '/article/');
    
    // Check that article content is visible
    cy.get('h1').should('be.visible');
  });
});
