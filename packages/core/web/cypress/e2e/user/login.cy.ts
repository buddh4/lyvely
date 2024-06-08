describe('Test User Login', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.load('/login');
  });

  it('Welcome - Greeting & Content', () => {
    cy.contains('h1', 'Sign in');
    cy.contains('Sign up').should('have.attr', 'href', '/sign-up');
  });

  it('Failed Login - Username Or Password required', () => {
    cy.get('[data-id="btn-to-password"]').click();
    cy.contains('Username or Email is required');
  });

  it('Failed Login - Password required', () => {
    cy.get('[data-id="login-usernameoremail"]').type('owner');
    cy.get('[data-id="btn-to-password"]').click();
    cy.get('[data-id="btn-login"]').click();
    cy.contains('Password is required');
  });

  it('Failed Login - Incorrect Password', function () {
    cy.get('[data-id="login-usernameoremail"]').type('owner');
    cy.get('[data-id="btn-to-password"]').click();
    cy.get('[data-id="login-password"]').type('TestPassword1234');
    cy.get('[data-id="btn-login"]').click();
    cy.contains('Invalid username/email or password. Please try again.');
  });

  it('Failed Login - Nonexisting user', function () {
    cy.get('[data-id="login-usernameoremail"]').type('DoesNotExist');
    cy.get('[data-id="btn-to-password"]').click();
    cy.get('[data-id="login-password"]').type('TestPassword123');
    cy.get('[data-id="btn-login"]').click();
    cy.contains('Invalid username/email or password. Please try again.');
  });

  it('Failed Login - User disabled', function () {
    cy.get('[data-id="login-usernameoremail"]').type('disabled');
    cy.get('[data-id="btn-to-password"]').click();
    cy.get('[data-id="login-password"]').type('TestPassword123');
    cy.get('[data-id="btn-login"]').click();
    cy.contains('This user account was disabled.');
  });

  it('Successful Login - username', function () {
    cy.get('[data-id="login-usernameoremail"]').type('owner');
    cy.get('[data-id="btn-to-password"]').click();
    cy.get('[data-id="login-password"]').type('TestPassword123');
    cy.get('[data-id="btn-login"]').click();
    cy.url().should('include', '/p/owner/stream');
    cy.getCookie('Authentication').should('exist');
    cy.getCookie('Refresh').should('exist');
  });

  it('Successful Login - email', function () {
    cy.get('[data-id="login-usernameoremail"]').type('owner@test.com');
    cy.get('[data-id="btn-to-password"]').click();
    cy.get('[data-id="login-password"]').type('TestPassword123');
    cy.get('[data-id="btn-login"]').click();
    cy.url().should('include', '/p/owner/stream');
    cy.getCookie('Authentication').should('exist');
    cy.getCookie('Refresh').should('exist');
  });

  it('Successful Login - enter', function () {
    cy.get('[data-id="login-usernameoremail"]').type('owner@test.com{enter}');
    cy.get('[data-id="login-password"]').type('TestPassword123{enter}');
    cy.url().should('include', '/p/owner/stream');
    cy.getCookie('Authentication').should('exist');
    cy.getCookie('Refresh').should('exist');
  });

  it('Successful Login - do remember', function () {
    cy.get('[data-id="login-usernameoremail"]').type('owner@test.com');
    cy.get('[data-id="btn-to-password"]').click();
    cy.get('[data-id="login-password"]').type('TestPassword123');
    cy.get('[data-id="login-remember"]').click();
    cy.get('[data-id="btn-login"]').click();
    cy.url().should('include', '/p/owner/stream');
    cy.getCookie('Refresh')
      .then((cookie) => cy.task('jwt:decode', cookie.value))
      .then((payLoad: any) => cy.wrap(payLoad.remember).should('equal', true));
  });

  it('Successful Login - do not remember', function () {
    cy.get('[data-id="login-usernameoremail"]').type('owner@test.com');
    cy.get('[data-id="btn-to-password"]').click();
    cy.get('[data-id="login-password"]').type('TestPassword123');
    cy.get('[data-id="btn-login"]').click();
    cy.url().should('include', '/p/owner/stream');
    cy.getCookie('Refresh')
      .then((cookie) => cy.task('jwt:decode', cookie.value))
      .then((payLoad: any) => cy.wrap(payLoad.remember).should('equal', false));
  });
});
