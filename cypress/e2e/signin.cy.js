describe('Sign In Page', () => {
  it('should render the sign in form', () => {
    cy.visit('/auth/signin');
    cy.contains('Login');
    cy.get('input[type=email]').should('exist');
    cy.get('input[type=password]').should('exist');
    cy.get('button[type=submit]').should('exist');
  });
});
