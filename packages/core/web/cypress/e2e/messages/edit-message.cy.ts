describe('User can send messages', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  it('Member can update message per api (API)', () => {
    cy.task('db:getObjectId', 'owner-profile-first').then((objectId: string) => {
      cy.profileApiPut(
        'owner-profile',
        '/messages/' + objectId,
        { text: 'Updated Message' },
        { as: 'owner' },
      ).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  it('Visitor can not edit message (API)', () => {
    cy.task('db:getObjectId', 'owner-profile-first').then((objectId: string) => {
      cy.profileApiPut('owner-profile', '/messages/' + objectId, { text: 'Visitor Message' }).then(
        (response) => {
          expect(response.status).to.eq(403);
        },
      );
    });
  });

  it.only('Can not submit empty message', () => {
    cy.authenticatedAs('owner');
    cy.loadProfile(`owner-profile/stream`);
    cy.getByObjectId('owner-profile-first', 'body').click();
    cy.getByObjectId('owner-profile-first', 'menu').click();
    cy.getId('content-edit').click();
    cy.getId('edit-message-text').clear().type('  ');
    cy.getId('btn-modal-submit').click();
    cy.contains('Message is required');
  });

  it('Success edit message', () => {
    cy.authenticatedAs('owner');
    cy.loadProfile(`owner-profile/stream`);
    cy.getByObjectId('owner-profile-first', 'body').click();
    cy.getByObjectId('owner-profile-first', 'menu').click();
    cy.getId('content-edit').click();
    cy.getId('edit-message-text').clear().type('Edited Text!');
    cy.getId('edit-message-tag-picker').click();
    cy.get('[data-badge-selection="Health"]').click();
    cy.getId('edit-message-tag-picker-modal').find('[data-id="btn-modal-submit"]').click();
    cy.getId('btn-modal-submit').click();
    cy.getByObjectId('owner-profile-first').contains('Edited Text!');
    cy.getByObjectId('owner-profile-first').contains('Health');
  });
});
