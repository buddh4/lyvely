describe('Test User Logout', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  afterEach(() => {
    cy.reload();
  });

  it('Successful logout by drawer', function () {
    cy.authenticatedAs('owner');
    cy.loadProfile('protected-group');
    cy.get('[data-id="btn-account-drawer"]').click();
    cy.get('[data-id="account-logout"]').click();
    cy.url().should('include', '/public-group');
    cy.getCookie('Authentication').should('not.exist');
    cy.getCookie('Refresh').should('not.exist');
  });

  it('Successful logout with disabled user', function () {
    cy.authenticatedAs('disabled');
    cy.loadProfile('protected-group');

    // TODO: This should be improved, inform the user about beeing locked or disabled
    cy.url().should('include', '/public-group');
    cy.getCookie('Authentication').should('not.exist');
    cy.getCookie('Refresh').should('not.exist');
  });

  it('Successful logout by path', function () {
    cy.authenticatedAs('owner');
    cy.loadProfile('protected-group');
    cy.visit('http://127.0.0.1:3002/logout');
    cy.url().should('include', '/public-group');
    cy.getCookie('Authentication').should('not.exist');
    cy.getCookie('Refresh').should('not.exist');
  });
});
