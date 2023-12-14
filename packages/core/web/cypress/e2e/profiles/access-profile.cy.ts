describe('Test profile access', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  it('Visitor can not access organization only group', () => {
    cy.loadProfile('organization-only-group/stream');
    cy.isForbidden();
  });

  it('Organization member can access organization only profile', () => {
    cy.authenticatedAs('member');
    cy.loadProfile('organization-only-group/stream');
    cy.getId('layout-profile').should('exist');
  });

  it('User can not access organization only profile', () => {
    cy.authenticatedAs('no-member');
    cy.loadProfile('organization-only-group/stream');
    cy.isForbidden();
  });

  it('Visitor can access public group', () => {
    cy.loadProfile('public-group');
    cy.getId('layout-profile').should('exist');
  });

  it('Visitor can not access protected (user only) group', () => {
    cy.loadProfile('member-group');
    cy.isForbidden();
  });

  it('User can access protected profile', () => {
    cy.authenticatedAs('no-member');
    cy.loadProfile('member-group/stream');
    cy.getId('layout-profile').should('exist');
  });

  it('User can not access others private profile', () => {
    cy.authenticatedAs('member');
    cy.isForbidden(`p/owner-profile/stream`);
  });

  it('Owner can access his own private profile', () => {
    cy.authenticatedAs('owner');
    cy.loadProfile('owner-profile');
    cy.getId('layout-profile').should('exist');
  });
});
