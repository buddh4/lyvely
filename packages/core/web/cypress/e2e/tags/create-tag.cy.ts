describe('User can create tags', function () {
  beforeEach(() => {
    cy.login('Jan', 'tags');
  });

  it('Success create tag - Password required', () => {
    cy.visit(`http://127.0.0.1:3000/p/Jan/tags`);
    cy.get('[data-id="btn-floating-add"]').click();
    cy.contains('Create Tag');
  });
});
