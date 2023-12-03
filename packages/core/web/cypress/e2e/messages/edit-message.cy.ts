describe('User can send messages', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  it('Member can update message per api (API)', () => {
    cy.task('db:getObjectId', 'jan-profile-message1').then((objectId: string) => {
      cy.profileApiPut(
        'jan-profile',
        '/messages/' + objectId,
        { text: 'Updated Message' },
        { as: 'Jan' },
      ).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  it('Visitor can not edit message (API)', () => {
    cy.task('db:getObjectId', 'jan-profile-message1').then((objectId: string) => {
      cy.profileApiPut('jan-profile', '/messages/' + objectId, { text: 'Visitor Message' }).then(
        (response) => {
          expect(response.status).to.eq(403);
        },
      );
    });
  });

  it.only('Can not submit empty message', () => {
    cy.authenticatedAs('Jan');
    cy.loadProfile(`jan-profile/stream`);
    cy.getByObjectId('jan-profile-message1', 'body').click();
    cy.getByObjectId('jan-profile-message1', 'menu').click();
    cy.getId('content-edit').click();
    cy.getId('edit-message-text').clear().type('  ');
    cy.getId('btn-modal-submit').click();
    cy.contains('Message is required');
  });

  it('Success edit message', () => {
    cy.authenticatedAs('Jan');
    cy.loadProfile(`jan-profile/stream`);
    cy.getByObjectId('jan-profile-message1', 'body').click();
    cy.getByObjectId('jan-profile-message1', 'menu').click();
    cy.getId('content-edit').click();
    cy.getId('edit-message-text').clear().type('Edited Text!');
    cy.getId('edit-message-tag-chooser').click();
    cy.get('[data-badge-selection="Health"]').click();
    cy.getId('edit-message-tag-chooser-modal').find('[data-id="btn-modal-submit"]').click();
    cy.getId('btn-modal-submit').click();
    cy.getByObjectId('jan-profile-message1').contains('Edited Text!');
    cy.getByObjectId('jan-profile-message1').contains('Health');
  });
});
