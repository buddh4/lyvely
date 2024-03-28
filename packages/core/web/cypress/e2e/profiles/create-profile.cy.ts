describe('Test profile access', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  it('Visitor can not create new profile', () => {
    cy.loadProfile('public-group/stream');
    cy.getId('btn-toggle-profile-relations').click();
    cy.getId('btn-create-profile').should('not.exist');

    cy.apiPost('/profiles', {
      name: 'ShouldFail',
      usage: ['Business'],
      visibility: 0,
      type: 'user',
    }).then((response) => {
      expect(response.status).to.eq(403);
    });
  });

  it('User can not create new organization', () => {
    cy.authenticatedAs('member');
    cy.loadProfile('public-group/stream');
    cy.getId('btn-toggle-profile-relations').click();
    cy.getId('btn-create-organization').should('not.exist');

    cy.apiPost('/profiles', {
      name: 'ShouldFail',
      usage: ['Business'],
      visibility: 0,
      type: 'organization',
    }).then((response) => {
      expect(response.status).to.eq(403);
    });
  });

  it('Admin can create new organization', () => {
    cy.authenticatedAs('admin');
    cy.loadProfile('public-group/stream');
    cy.getId('btn-toggle-profile-relations').click();
    cy.getId('btn-create-organization').click();

    cy.getId('create-profile-name').type('My Organization');
    cy.getId('create-profile-description').type('Big things are about to happen');
    cy.getId('create-profile-type-organization').click();
    cy.getId('btn-modal-submit').click();
    cy.url().should('include', '/My-Organization/stream');
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
});
