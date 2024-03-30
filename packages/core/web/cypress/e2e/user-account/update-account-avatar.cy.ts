// Only member can access
// Member can change
describe('User Account Avatar', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.task('uploads:delete');
  });

  it('User can update his avatar', () => {
    cy.authenticatedAs('member');
    cy.loadProfile('protected-group');
    cy.getId('btn-account-drawer').click();
    cy.getId('my-account').click();
    cy.getId('btn-change-avatar').click();
    cy.getId('avatar-input').selectFile('cypress/e2e/user-account/avatar.jpeg', { force: true });
    cy.getId('btn-modal-submit').click();
    cy.get('img[data-id="my-account-avatar"]');
    cy.get('img[data-id="account-drawer-avatar"]');
  });
});
