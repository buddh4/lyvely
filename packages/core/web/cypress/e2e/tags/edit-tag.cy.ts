describe('User can create tags', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.authenticatedAs('Jan');
  });

  it('Failed edit tag - unique name', () => {
    cy.load('/p/Jan/tags');
    cy.getByObjectId('tag-health', 'btn-edit').click();
    cy.getId('edit-tag-name').clear().type('Education');
    cy.getId('btn-modal-submit').click();
    cy.contains('Name already exists');
  });

  it('Success edit tag', () => {
    cy.load('/p/Jan/tags');
    cy.getByObjectId('tag-health', 'btn-edit').click();
    cy.getId('edit-tag-name').clear().type('UpdatedTag');
    cy.getId('edit-tag-description').clear().type('A new test tag');
    cy.getId('btn-modal-submit').click();
    cy.getByObjectId('tag-health').contains('UpdatedTag');
  });
});
