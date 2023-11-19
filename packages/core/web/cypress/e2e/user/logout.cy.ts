describe('Test User Logout', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.login();
  });

  afterEach(() => {
    cy.reload();
  });

  it('Logout - Drawer', function () {
    cy.get('[data-id="btn-account-drawer"]').click();
    cy.get('[data-id="account-logout"]').click();
    cy.url().should('include', '/login');
    cy.getCookie('Authentication').should('not.exist');
    cy.getCookie('Refresh').should('not.exist');
  });

  it('Logout - Path', function () {
    cy.visit('http://127.0.0.1:3000/logout');
    cy.url().should('include', '/login');
    cy.getCookie('Authentication').should('not.exist');
    cy.getCookie('Refresh').should('not.exist');
  });
});
