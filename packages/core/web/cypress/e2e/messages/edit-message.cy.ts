describe('User can send messages', function () {
  beforeEach(() => {
    cy.task('db:seed');
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

  /*
  it('Member can create message per api (ACL)', () => {
    cy.profileApiPost('public-group', '/messages', { text: 'Visitor Message' }, { as: 'Jan' }).then(
      (response) => {
        expect(response.status).to.eq(201);
      },
    );
  });

  it('Visitor can not input message', () => {
    cy.loadProfile(`public-group/stream`);
    cy.getId('content-stream-root').should('exist');
    cy.getId('stream-input').should('not.exist');
  });

  it('Success create message - Modal', () => {
    cy.authenticatedAs('Jan');
    cy.loadProfile(`jan-profile/stream`);
    cy.getId('stream-input').type('This is a test message!');
    cy.getId('btn-stream-add').click();
    cy.getId('btn-modal-submit').click();
    cy.get('[data-stream-entry]').contains('This is a test message!');
  });

  it('Success create message - Stream as member', () => {
    cy.authenticatedAs('Jan');
    cy.loadProfile(`jan-profile/stream`);
    cy.getId('stream-input').type('This is a test message!');
    cy.getId('btn-stream-submit').click();
    cy.get('[data-stream-entry]').contains('This is a test message!');
  });*/
});
