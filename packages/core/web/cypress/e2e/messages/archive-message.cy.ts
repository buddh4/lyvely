describe('User can archive messages', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  it('User can archive his own message', () => {
    cy.authenticatedAs('owner');
    cy.loadProfile(`owner-profile/stream`);
    cy.getByObjectId('owner-profile-message1', 'body').click();
    cy.getByObjectId('owner-profile-message1', 'menu').click();
    cy.getId('content-archive').click();
    cy.contains('Confirm action');
    cy.getId('btn-modal-submit').click();
    cy.get('.icon-archive').should('exist');
    cy.getId('btn-back').click();
    cy.wait(100);
    cy.getByObjectId('owner-profile-message1').should('not.exist');
  });
});
