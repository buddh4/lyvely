describe('User can send messages', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  it('Visitor can not input message', () => {
    cy.loadProfile(`public-group/stream`);
    cy.getId('content-stream-root').should('exist');
    cy.getId('stream-input').should('not.exist');
  });

  /*it('Success create message - Modal', () => {
    cy.authenticatedAs('Jan');
    cy.visit(`http://127.0.0.1:3000/p/Jan/stream`);
    cy.getId('stream-input').type('This is a test message!');
    cy.getId('btn-stream-add').click();
    cy.getId('btn-modal-submit').click();
    cy.get('[data-stream-entry]').contains('This is a test message!');
  });

  it('Success create message - Stream as member', () => {
    cy.authenticatedAs('Jan');
    cy.visit(`http://127.0.0.1:3000/p/Jan/stream`);
    cy.getId('stream-input').type('This is a test message!');
    cy.getId('btn-stream-submit').click();
    cy.get('[data-stream-entry]').contains('This is a test message!');
  });*/
});
