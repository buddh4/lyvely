describe('Test profile access', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  it('Owner can archive profile', () => {
    cy.authenticatedAs('owner');
    cy.loadProfile('protected-group/general');
    cy.getId('archive-profile').click();
    cy.getId('btn-modal-submit').click();

    cy.contains('[data-id="profile-drawer"]', 'Archived');
    cy.getId('btn-toggle-profile-relations').click();
    cy.getId('profile-relations').should('contain', 'Private Group');
    cy.getId('profile-relations').should('not.contain', 'Protected Group');
  });
});
