describe('Test Forgot Password', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.task('mails:delete');
  });

  afterEach(() => {
    cy.reload();
  });

  it('Failed Passwort Reset - Captcha', () => {
    cy.visit('http://127.0.0.1:3000/reset-password');
    cy.contains('Reset your password');
    cy.get('[data-id="send-mail-usernameoremail"]').type('Jan');
    cy.get('[data-id="reset-password-captcha"]').type('12345{enter}');
    cy.contains('The code is not valid');
  });

  it('Successful Passwort Reset - Email', () => {
    cy.visit('http://127.0.0.1:3000');
    // Login screen
    cy.get('[data-id="login-usernameoremail"]').type('jan@test.com{enter}');

    // Password screen
    cy.get('[data-id="reset-password"]').click();

    // Captcha screen
    cy.get('[data-id="send-mail-usernameoremail"]').invoke('val').should('eq', 'jan@test.com');
    cy.contains('Reset your password');
    cy.get('[data-id="reset-password-captcha"]').type('01234{enter}');
    cy.contains('Check your email for a link to reset your password.');
    cy.task(
      'mails:extract',
      '\\[(http:\\/\\/127\\.0\\.0\\.1:3000\\/reset-password\\/\\?t=[^\\]].*)]',
    ).then((result: string[]) => cy.visit(result[0]));

    // Reset password screen
    cy.get('[data-id="reset-password-password"]').type('NewPassword');
    cy.get('[data-id="reset-password-passwordrepeat"]').type('NewPassword');
    cy.get('[data-id="btn-submit"]').click();

    // Login screen
    cy.url().should('eq', 'http://127.0.0.1:3000/login');
    cy.get('[data-id="login-usernameoremail"]').type('Jan');
    cy.get('[data-id="btn-to-password"]').click();
    cy.get('[data-id="login-password"]').type('NewPassword{enter}');
    cy.url().should('include', '/p/Jan/stream');
    cy.getCookie('Authentication').should('exist');
    cy.getCookie('Refresh').should('exist');
  });

  it('Successful Passwort Reset - Username', () => {
    cy.visit('http://127.0.0.1:3000');
    // Login screen
    cy.get('[data-id="login-usernameoremail"]').type('Jan{enter}');

    // Password screen
    cy.get('[data-id="reset-password"]').click();

    // Captcha screen
    cy.get('[data-id="send-mail-usernameoremail"]').invoke('val').should('eq', 'Jan');
    cy.contains('Reset your password');
    cy.get('[data-id="reset-password-captcha"]').type('01234{enter}');
    cy.contains('Check your email for a link to reset your password.');
    cy.task(
      'mails:extract',
      '\\[(http:\\/\\/127\\.0\\.0\\.1:3000\\/reset-password\\/\\?t=[^\\]].*)]',
    ).then((result: string[]) => cy.visit(result[0]));

    // Reset password screen
    cy.get('[data-id="reset-password-password"]').type('NewPassword');
    cy.get('[data-id="reset-password-passwordrepeat"]').type('NewPassword');
    cy.get('[data-id="btn-submit"]').click();

    // Login screen
    cy.url().should('eq', 'http://127.0.0.1:3000/login');
    cy.get('[data-id="login-usernameoremail"]').type('Jan');
    cy.get('[data-id="btn-to-password"]').click();
    cy.get('[data-id="login-password"]').type('NewPassword{enter}');
    cy.url().should('include', '/p/Jan/stream');
    cy.getCookie('Authentication').should('exist');
    cy.getCookie('Refresh').should('exist');
  });
});
