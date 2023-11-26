describe('User can create tags', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.authenticatedAs('Jan');
  });

  it('Failed create tag - Tag name exists', () => {
    cy.visit(`http://127.0.0.1:3000/p/Jan/tags`);
    cy.getId('btn-floating-add').click();
    cy.getId('edit-tag-name').type('Health');
    cy.getId('btn-modal-submit').click();
    cy.contains('Name already exists');
  });

  it('Success create tag', () => {
    cy.visit(`http://127.0.0.1:3000/p/Jan/tags`);
    cy.getId('btn-floating-add').click();
    cy.getId('edit-tag-name').type('Business');
    cy.getId('edit-tag-description').type('Everything to do with business');
    cy.getId('btn-modal-submit').click();
    cy.get('[data-tag-id]').contains('Business');
  });
});
