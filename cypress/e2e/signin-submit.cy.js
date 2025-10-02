 describe('Sign In Flow', () => {
  // it('shows error on invalid credentials', () => {
  //   cy.visit('/auth/signin');
  //   cy.get('input[type=email]').type('invalid@example.com');
  //   cy.get('input[type=password]').type('wrongpassword');
  //   cy.get('button[type=submit]').click();
  //   cy.contains('Invalid credentials', { timeout: 5000 });
  // });

  // Add a valid credentials test if you have a test user
  it('redirects on valid credentials', () => {
    cy.visit('/auth/signin');
    cy.get('input[type=email]').type('validuser@example.com');
    cy.get('input[type=password]').type('validpassword');
    cy.get('button[type=submit]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
