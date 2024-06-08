describe('Revoke Profile Membership', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  it('Member can revoke profile membership in public group', () => {
    cy.authenticatedAs('member');
    cy.loadProfile('public-group/membership');
    cy.getId('btn-revoke').click();
    cy.getId('btn-modal-submit').click();
    cy.contains('.flash-message', 'Success');
    cy.url().should('include', 'public-group/stream');
    cy.getId('btn-toggle-profile-relations').click();
    cy.getId('profile-relations').should('not.contain', 'Public Group');
  });

  it('Member can revoke profile membership in private group', () => {
    cy.authenticatedAs('member');
    cy.loadProfile('private-group/membership');
    cy.getId('btn-revoke').click();
    cy.getId('btn-modal-submit').click();
    cy.contains('.flash-message', 'Success');
    cy.url().should('not.include', 'private-group');
    cy.getId('btn-toggle-profile-relations').click();
    cy.getId('profile-relations').should('not.contain', 'Private Group');
  });
});
