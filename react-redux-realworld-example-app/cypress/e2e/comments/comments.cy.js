describe('Comments Management', () => {
  let testUser;
  let articleSlug;

  before(() => {
    // Load test user data
    cy.fixture('users').then((users) => {
      testUser = users.testUser;
      
      // Register and login
      cy.register(testUser.email, testUser.username, testUser.password);
      cy.login(testUser.email, testUser.password);

      // Create an article for testing comments
      cy.createArticle({
        title: `Comment Test Article ${Date.now()}`,
        description: 'Article for testing comments',
        body: 'This article is used to test comment functionality',
        tagList: ['comments', 'test']
      }).then((article) => {
        articleSlug = article.slug;
      });
    });
  });

  beforeEach(() => {
    // Login before each test
    cy.login(testUser.email, testUser.password);
    // Navigate to the test article
    cy.visit(`/article/${articleSlug}`);
  });

  after(() => {
    cy.logout();
  });

  it('should add a comment to an article', () => {
    const commentText = `Test comment ${Date.now()}`;

    // Find and fill comment textarea
    cy.get('textarea[placeholder="Write a comment..."]').type(commentText);

    // Submit the comment
    cy.contains('button', 'Post Comment').click();

    // Verify comment appears
    cy.contains('.card-text', commentText).should('be.visible');
  });

  it('should display existing comments', () => {
    const commentText = `Existing comment ${Date.now()}`;

    // Add a comment first
    cy.get('textarea[placeholder="Write a comment..."]').type(commentText);
    cy.contains('button', 'Post Comment').click();

    // Reload the page
    cy.reload();

    // Verify comment is still visible
    cy.contains('.card-text', commentText).should('be.visible');
  });

  it('should delete a comment', () => {
    const commentText = `Delete comment ${Date.now()}`;

    // Add a comment
    cy.get('textarea[placeholder="Write a comment..."]').type(commentText);
    cy.contains('button', 'Post Comment').click();

    // Wait for comment to appear
    cy.contains('.card-text', commentText).should('be.visible');

    // Find and click delete button for this comment
    cy.contains('.card-text', commentText)
      .parents('.card')
      .find('.mod-options')
      .find('i.ion-trash-a')
      .click();

    // Verify comment is removed
    cy.contains('.card-text', commentText).should('not.exist');
  });

  it('should show comment author information', () => {
    const commentText = `Author info comment ${Date.now()}`;

    // Add a comment
    cy.get('textarea[placeholder="Write a comment..."]').type(commentText);
    cy.contains('button', 'Post Comment').click();

    // Verify author information is displayed
    cy.contains('.card-text', commentText)
      .parents('.card')
      .within(() => {
        cy.get('.comment-author').should('contain', testUser.username);
        cy.get('.date-posted').should('exist');
      });
  });

  it('should prevent adding empty comments', () => {
    // Try to submit empty comment
    cy.contains('button', 'Post Comment').click();

    // Verify comment form still exists (no submission)
    cy.get('textarea[placeholder="Write a comment..."]').should('be.visible');
  });

  it('should display multiple comments in order', () => {
    const comment1 = `First comment ${Date.now()}`;
    const comment2 = `Second comment ${Date.now()}`;
    const comment3 = `Third comment ${Date.now()}`;

    // Add three comments
    cy.get('textarea[placeholder="Write a comment..."]').type(comment1);
    cy.contains('button', 'Post Comment').click();
    cy.wait(500);

    cy.get('textarea[placeholder="Write a comment..."]').type(comment2);
    cy.contains('button', 'Post Comment').click();
    cy.wait(500);

    cy.get('textarea[placeholder="Write a comment..."]').type(comment3);
    cy.contains('button', 'Post Comment').click();

    // Verify all comments are visible
    cy.contains('.card-text', comment1).should('be.visible');
    cy.contains('.card-text', comment2).should('be.visible');
    cy.contains('.card-text', comment3).should('be.visible');
  });
});
