describe('Content stream visibility', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  it('User can not see archived or deleted entries', () => {
    cy.authenticatedAs('owner');
    cy.loadProfile(`owner-profile/stream`);
    cy.getByObjectId('owner-profile-first').should('exist');
    cy.getByObjectId('owner-profile-locked').should('exist');
    cy.getByObjectId('owner-profile-archived').should('not.exist');
    cy.getByObjectId('owner-profile-deleted').should('not.exist');
  });
});
