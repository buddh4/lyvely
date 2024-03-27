describe('Test profile access', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  it('User can create new user profile', () => {
    cy.authenticatedAs('member');
    cy.loadProfile('public-group/stream');
    cy.getId('btn-toggle-profile-relations').click();
    cy.getId('btn-create-profile').click();
    cy.getId('create-profile-name').type('Work Stuff');
    cy.getId('create-profile-description').type('Plan and make stuff for work');
    cy.getId('create-profile-type-user').click();
    cy.getId('btn-modal-submit').click();
    cy.url().should('include', '/Work-Stuff/stream');
  });

  it('User can create new group profile', () => {
    cy.authenticatedAs('member');
    cy.loadProfile('public-group/stream');
    cy.getId('btn-toggle-profile-relations').click();
    cy.getId('btn-create-profile').click();
    cy.getId('create-profile-name').type('Power Team');
    cy.getId('create-profile-description').type('Work hard, work together');
    cy.getId('create-profile-type-group').click();
    cy.getId('btn-modal-submit').click();
    cy.url().should('include', '/Power-Team/stream');
  });

  it('Visitor can not create new user profile', () => {
    cy.loadProfile('public-group/stream');
    cy.getId('btn-toggle-profile-relations').click();
    cy.getId('btn-create-profile').should('not.exist');
  });
});
