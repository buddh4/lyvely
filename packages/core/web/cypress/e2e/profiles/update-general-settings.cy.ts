// Only member can access
// Member can change
describe('General Profile Settings', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  /* it('Non member can non update general settings', () => {
    cy.authenticatedAs('no-member');
    cy.getId('profileSettings').click();

    cy.loadProfile('public-group/general');
    cy.isForbidden();

    cy.apiPut('/profiles', {
      name: 'ShouldNotWork',
    }).then((response) => {
      expect(response.status).to.eq(403);
    });
  });

  it('Visitor can non update general settings', () => {
    cy.loadProfile('public-group/membership');
    cy.isForbidden();

    cy.apiPut('/profiles', {
      name: 'ShouldNotWork',
    }).then((response) => {
      expect(response.status).to.eq(403);
    });
  });

  it('Member can not update general settings', () => {
    cy.authenticatedAs('member');
    cy.loadProfile('public-group/general');
    cy.isForbidden();

     cy.getId('profileSettings').click();
     cy.getId('generalProfileSettings').should('not.exist');

    cy.apiPut('/profiles', {
      name: 'ShouldNotWork',
    }).then((response) => {
      expect(response.status).to.eq(403);
    });
  });
*/
  it('Admin can update membership settings', () => {
    cy.authenticatedAs('admin');
    cy.loadProfile('public-group');
    cy.getId('profileSettings').click();
    cy.getId('generalProfileSettings').click();

    cy.getId('profile-settings-name').clear().type('Welcome');
    cy.getId('profile-settings-description').clear().type('Welcome to Lyvely!');
    cy.getId('btn-submit-settings').click();
    cy.contains('.flash-message', 'Saved');
    cy.contains('[data-id="profile-breadcrumb"]', 'Welcome');
  });
});
