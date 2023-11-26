describe('User can create tags', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.authenticatedAs('Jan');
  });

  it('Failed create tag - Tag name exists', () => {
    cy.visit(`http://127.0.0.1:3000/p/Jan/tags`);
    cy.wait(1000);
    cy.getId('btn-floating-add').click();
    cy.getId('edit-task-name').type('TestTag');
    cy.getId('edit-task-description').type('A new test tag');
    cy.getId('btn-modal-submit').click();
    cy.get('[data-tag-id]').contains('NewTag');
  });

  /*it('Success create tag', () => {
    cy.visit(`http://127.0.0.1:3000/p/Jan/tags`);
    cy.getId('btn-floating-add').click();
    cy.getId('edit-task-name').type('NewTag');
    cy.getId('edit-task-description').type('A new test tag');
    cy.getId('btn-modal-submit').click();
    cy.get('[data-tag-id]').contains('NewTag');
  });*/
});
