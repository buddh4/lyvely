// Only member can access
// Member can change
describe('Membership Settings', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  it('Non member can non update membership settings', () => {
    cy.authenticatedAs('no-member');
    cy.loadProfile('public-group/stream');
    cy.getId('content-stream-root').should('exist');
    cy.getId('profileSettings').should('not.exist');

    cy.loadProfile('public-group/membership');
    cy.url().should('include', '/403');

    cy.profileApiPost('public-group', '/membership', {
      displayName: 'ImNoMember',
      description: 'I tried...',
    }).then((response) => {
      expect(response.status).to.eq(403);
    });
  });

  it('Visitor can non update membership settings', () => {
    cy.loadProfile('public-group/stream');
    cy.getId('content-stream-root').should('exist');
    cy.getId('profileSettings').should('not.exist');

    cy.loadProfile('public-group/membership');
    cy.url().should('include', '/403');

    cy.profileApiPost('public-group', '/membership', {
      displayName: 'ImNoMember',
      description: 'I tried...',
    }).then((response) => {
      expect(response.status).to.eq(403);
    });
  });

  it('Member can update membership settings', () => {
    cy.authenticatedAs('member');
    cy.loadProfile('protected-group');
    cy.getId('profileSettings').click();
    cy.getId('profileMembership').click();
    cy.getId('profile-membership-settings-displayname').clear().type('Buddh4Monk');
    cy.getId('profile-membership-settings-description')
      .clear()
      .type('Not smart, but good looking.');
    cy.getId('btn-submit-settings').click();
    cy.contains('.flash-message', 'Saved').click();
    cy.getId('stream').click();
    cy.contains('[data-stream-entry]', 'Buddh4Monk');
  });
});
