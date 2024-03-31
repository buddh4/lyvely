// Only member can access
// Member can change
describe('User Account Avatar', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.task('uploads:delete');
  });

  it('Admin can update profile avatar', () => {
    cy.authenticatedAs('admin');
    cy.loadProfile('protected-group/general');
    cy.getId('btn-change-avatar').click();
    cy.getId('avatar-input').selectFile('cypress/files/avatar.jpeg', { force: true });
    cy.getId('btn-modal-submit').click();
    cy.get('img[data-id="active-profile-avatar"]').should('exist');
  });
});
