describe('User can send messages', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  it('Can not create empty message', () => {
    cy.authenticatedAs('owner');
    cy.loadProfile(`public-group/stream`);
    cy.getId('stream-input').type(' ');
    cy.getId('btn-stream-submit').click();
    cy.wait(100);
    cy.getId('empty-stream').should('exist');
  });

  it('Visitor can not create message (ACL)', () => {
    cy.profileApiPost('public-group', '/messages', { text: 'Visitor Message' }).then((response) => {
      expect(response.status).to.eq(403);
    });
  });

  it('Member can create message per api (ACL)', () => {
    cy.profileApiPost(
      'public-group',
      '/messages',
      { text: 'Visitor Message' },
      { as: 'owner' },
    ).then((response) => {
      expect(response.status).to.eq(201);
    });
  });

  it('Visitor can not input message', () => {
    cy.loadProfile(`public-group/stream`);
    cy.getId('content-stream-root').should('exist');
    cy.getId('stream-input').should('not.exist');
  });

  it('Success create message - Modal', () => {
    cy.authenticatedAs('owner');
    cy.loadProfile(`owner-profile/stream`);
    cy.getId('stream-input').type('This is a test message!');
    cy.getId('btn-stream-add').click();
    cy.getId('btn-modal-submit').click();
    cy.get('[data-stream-entry]').contains('This is a test message!');
  });

  it('Success create message - Stream as member', () => {
    cy.authenticatedAs('owner');
    cy.loadProfile(`owner-profile/stream`);
    cy.getId('stream-input').type('This is a test message!');
    cy.getId('btn-stream-submit').click();
    cy.get('[data-stream-entry]').contains('This is a test message!');
  });
});
