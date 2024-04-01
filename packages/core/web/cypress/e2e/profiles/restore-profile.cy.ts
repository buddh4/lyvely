describe('Test profile access', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  it('Owner can archive profile', () => {
    cy.authenticatedAs('owner');
    cy.loadProfile('archived-group/general');
    cy.getId('restore-profile').click();
    cy.getId('btn-modal-submit').click();

    cy.getId('profile-drawer').find('[role="alert"]').should('not.exist');
    cy.getId('btn-toggle-profile-relations').click();
    cy.getId('profile-relations').should('contain', 'Archived Group');
  });
});
