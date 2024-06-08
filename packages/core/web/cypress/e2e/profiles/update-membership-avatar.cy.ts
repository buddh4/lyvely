// Only member can access
// Member can change
describe('Update Membership Avatar', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.task('uploads:delete');
  });

  it('User can update his membership avatar', () => {
    cy.authenticatedAs('member');
    cy.loadProfile('protected-group');
    cy.getId('profileSettings').click();
    cy.getId('profileMembership').click();
    cy.getId('btn-change-avatar').click();
    cy.getId('avatar-input').selectFile('cypress/files/avatar.jpeg', { force: true });
    cy.getId('btn-modal-submit').click();
    cy.get('img[data-id="user-relation-avatar"]').should('exist');
  });
});
