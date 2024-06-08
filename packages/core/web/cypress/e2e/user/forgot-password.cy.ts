describe('Test Forgot Password', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.task('mails:delete');
  });

  afterEach(() => {
    cy.reload();
  });

  it('Failed Passwort Reset - Captcha', () => {
    cy.load('/reset-password');
    cy.contains('Reset your password');
    cy.get('[data-id="send-mail-usernameoremail"]').type('owner');
    cy.get('[data-id="reset-password-captcha"]').type('12345{enter}');
    cy.contains('The code is not valid');
  });

  it('Successful Passwort Reset - Email', () => {
    cy.load('/login');
    // Login screen
    cy.get('[data-id="login-usernameoremail"]').type('owner@test.com{enter}');

    // Password screen
    cy.get('[data-id="reset-password"]').click();

    // Captcha screen
    cy.get('[data-id="send-mail-usernameoremail"]').invoke('val').should('eq', 'owner@test.com');
    cy.contains('Reset your password');
    cy.get('[data-id="reset-password-captcha"]').type('01234{enter}');
    cy.contains('Check your email for a link to reset your password.');
    cy.task(
      'mails:extract',
      '\\[(http:\\/\\/127\\.0\\.0\\.1:3002\\/reset-password\\/\\?t=[^\\]].*)]'
    ).then((result: string[]) => cy.visit(result[0]));

    // Reset password screen
    cy.get('[data-id="reset-password-password"]').type('NewPassword');
    cy.get('[data-id="reset-password-passwordrepeat"]').type('NewPassword');
    cy.get('[data-id="btn-submit"]').click();

    // Login screen
    cy.url().should('eq', 'http://127.0.0.1:3002/login');
    cy.get('[data-id="login-usernameoremail"]').type('owner');
    cy.get('[data-id="btn-to-password"]').click();
    cy.wait(100);
    cy.get('[data-id="login-password"]').type('NewPassword{enter}');
    cy.url().should('include', '/stream');
    cy.getCookie('Authentication').should('exist');
    cy.getCookie('Refresh').should('exist');
  });

  it('Successful Passwort Reset - Username', () => {
    cy.load('/login');
    // Login screen
    cy.get('[data-id="login-usernameoremail"]').type('owner{enter}');

    // Password screen
    cy.get('[data-id="reset-password"]').click();

    // Captcha screen
    cy.get('[data-id="send-mail-usernameoremail"]').invoke('val').should('eq', 'owner');
    cy.contains('Reset your password');
    cy.get('[data-id="reset-password-captcha"]').type('01234{enter}');
    cy.contains('Check your email for a link to reset your password.');
    cy.task(
      'mails:extract',
      '\\[(http:\\/\\/127\\.0\\.0\\.1:3002\\/reset-password\\/\\?t=[^\\]].*)]'
    ).then((result: string[]) => cy.visit(result[0]));

    // Reset password screen
    cy.get('[data-id="reset-password-password"]').type('NewPassword');
    cy.get('[data-id="reset-password-passwordrepeat"]').type('NewPassword');
    cy.get('[data-id="btn-submit"]').click();

    // Login screen
    cy.url().should('eq', 'http://127.0.0.1:3002/login');
    cy.get('[data-id="login-usernameoremail"]').type('owner');
    cy.get('[data-id="btn-to-password"]').click();
    cy.wait(100);
    cy.get('[data-id="login-password"]').type('NewPassword{enter}');
    cy.url().should('include', '/stream');
    cy.getCookie('Authentication').should('exist');
    cy.getCookie('Refresh').should('exist');
  });
});
