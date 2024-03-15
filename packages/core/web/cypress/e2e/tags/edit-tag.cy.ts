describe('User can create tags', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.authenticatedAs('owner');
  });

  it('Failed edit tag - unique name', () => {
    cy.loadProfile('owner-profile', '/tags');
    cy.getByObjectId('tag-health', 'btn-edit').click();
    cy.getId('edit-tag-name').clear().type('Education');
    cy.getId('btn-modal-submit').click();
    cy.contains('Name already exists');
  });

  it('Success edit tag', () => {
    cy.loadProfile('owner-profile', '/tags');
    cy.getByObjectId('tag-health', 'btn-edit').click();
    cy.getId('edit-tag-name').clear().type('UpdatedTag');
    cy.getId('edit-tag-description').clear().type('A new test tag');
    cy.getId('btn-modal-submit').click();
    cy.getByObjectId('tag-health').contains('UpdatedTag');
  });
});
