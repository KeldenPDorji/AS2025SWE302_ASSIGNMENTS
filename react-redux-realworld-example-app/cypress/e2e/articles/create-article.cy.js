describe('Article Creation', () => {
  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.login(users.testUser.email, users.testUser.password);
    });
    cy.visit('/editor');
  });

  it('should display article editor form', () => {
    cy.get('input[placeholder="Article Title"]').should('be.visible');
    cy.get('input[placeholder="What\'s this article about?"]').should('be.visible');
    cy.get('textarea[placeholder="Write your article (in markdown)"]').should('be.visible');
    cy.get('input[placeholder="Enter tags"]').should('be.visible');
  });

  it('should create a new article successfully', () => {
    const timestamp = Date.now();
    const title = `Test Article ${timestamp}`;

    cy.get('input[placeholder="Article Title"]').type(title);
    cy.get('input[placeholder="What\'s this article about?"]').type('Test Description');
    cy.get('textarea[placeholder="Write your article (in markdown)"]').type('# Test Content\n\nThis is test content.');
    cy.get('input[placeholder="Enter tags"]').type('test{enter}');
    cy.contains('button', 'Publish Article').click();

    // Wait for redirect and page load
    cy.url().should('include', '/article/', { timeout: 10000 });
    cy.wait(1000);

    // Article should be displayed
    cy.contains('h1', title, { timeout: 10000 }).should('be.visible');
  });

  it('should add multiple tags', () => {
    cy.get('input[placeholder="Enter tags"]').type('tag1{enter}');
    cy.get('input[placeholder="Enter tags"]').type('tag2{enter}');
    cy.get('input[placeholder="Enter tags"]').type('tag3{enter}');

    cy.get('.tag-default').should('have.length', 3);
    cy.contains('tag1').should('be.visible');
    cy.contains('tag2').should('be.visible');
    cy.contains('tag3').should('be.visible');
  });

  it('should remove tags', () => {
    cy.get('input[placeholder="Enter tags"]').type('tag1{enter}');
    cy.get('input[placeholder="Enter tags"]').type('tag2{enter}');

    // Click X to remove tag - try multiple possible selectors
    cy.get('.tag-default').first().then(($tag) => {
      if ($tag.find('ion-icon').length > 0) {
        cy.wrap($tag).find('ion-icon').click();
      } else if ($tag.find('i').length > 0) {
        cy.wrap($tag).find('i').click();
      } else {
        // Click the tag itself if no icon found
        cy.wrap($tag).click();
      }
    });

    // Should have one less tag
    cy.get('.tag-default').should('have.length', 1);
  });

  it('should show validation for required fields', () => {
    cy.contains('button', 'Publish Article').click();

    // Should remain on editor page
    cy.url().should('include', '/editor');
  });
});
