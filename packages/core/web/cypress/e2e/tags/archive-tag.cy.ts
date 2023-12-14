describe('User can create tags', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.authenticatedAs('owner');
  });

  it('Success archive tag', () => {
    cy.load('/p/owner/tags');
    cy.getByObjectId('tag-health', 'btn-archive').click();
    cy.contains('Confirm action');
    cy.getId('btn-modal-submit').click();
    cy.getByObjectId('tag-health').should('not.exist');
  });

  it('Restore tag', () => {
    cy.load('/p/owner/tags');
    cy.getByObjectId('tag-social').should('not.exist');
    cy.getId('btn-toggle-archived').click();
    cy.getByObjectId('tag-social').should('exist');
    cy.getByObjectId('tag-social', 'btn-restore').click();
    cy.contains('Confirm action');
    cy.getId('btn-modal-submit').click();
    cy.getId('btn-toggle-archived').click();
    cy.getByObjectId('tag-health').should('exist');
    cy.getByObjectId('tag-education').should('exist');
    cy.getByObjectId('tag-social').contains('Social');
  });
});
