describe('Test Forgot Password', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.task('api:deleteMails');
    cy.visit('http://127.0.0.1:3000/logout');
  });

  afterEach(() => {
    cy.reload();
  });

  it('Successful Passwort Reset - Username', () => {
    cy.get('[data-id="login-usernameoremail"]').type('Jan{enter}');
    cy.get('[data-id="reset-password"]').click();
    cy.get('[data-id="send-mail-usernameoremail"]').invoke('val').should('eq', 'Jan');
    cy.contains('Reset your password');
    cy.get('[data-id="reset-password-captcha"]').type('01234{enter}');
    cy.contains('Check your email for a link to reset your password.');
    cy.wait(20000);
  });
});
