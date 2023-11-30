describe('Test profile access', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  it('Visitor can not access organization only group', () => {
    cy.loadProfile('organization-member-group/stream');
    cy.isForbidden();
  });

  it('Organization member can access organization only profile', () => {
    cy.authenticatedAs('Peter');
    cy.loadProfile('organization-member-group/stream');
    cy.getId('layout-profile').should('exist');
  });

  it('User can not access organization only profile', () => {
    cy.authenticatedAs('no-member');
    cy.loadProfile('organization-member-group/stream');
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
    cy.authenticatedAs('Peter');
    cy.isForbidden(`p/jan-profile/stream`);
  });

  it('Owner can access his own private profile', () => {
    cy.authenticatedAs('Jan');
    cy.loadProfile('jan-profile');
    cy.getId('layout-profile').should('exist');
  });
});
