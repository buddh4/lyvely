describe('Test User Login/Logout', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.visit('http://127.0.0.1:3000/logout');
  });

  afterEach(() => {
    cy.reload();
  });

  it('Welcome - Greeting & Content', () => {
    cy.contains('h1', 'Sign in');
    cy.contains('Sign up').should('have.attr', 'href', '/register');
  });

  it('Failed Login - Username Or Password required', () => {
    cy.get('[data-id="btn-to-password"]').click();
    cy.contains('Username or Email is required');
  });

  it('Failed Login - Password required', () => {
    cy.get('[data-id="login-usernameoremail"]').type('Jan');
    cy.get('[data-id="btn-to-password"]').click();
    cy.get('[data-id="btn-login"]').click();
    cy.contains('Password is required');
  });

  it('Failed Login - Incorrect Password', function () {
    cy.get('[data-id="login-usernameoremail"]').type('Jan');
    cy.get('[data-id="btn-to-password"]').click();
    cy.get('[data-id="login-password"]').type('TestPassword1234');
    cy.get('[data-id="btn-login"]').click();
    cy.contains('Invalid username/email or password. Please try again.');
  });

  it('Failed Login - Nonexisting user', function () {
    cy.get('[data-id="login-usernameoremail"]').type('DoesNotExist');
    cy.get('[data-id="btn-to-password"]').click();
    cy.get('[data-id="login-password"]').type('TestPassword1234');
    cy.get('[data-id="btn-login"]').click();
    cy.contains('Invalid username/email or password. Please try again.');
  });

  it('Successful Login - username', function () {
    cy.get('[data-id="login-usernameoremail"]').type('Jan');
    cy.get('[data-id="btn-to-password"]').click();
    cy.get('[data-id="login-password"]').type('TestPassword123');
    cy.get('[data-id="btn-login"]').click();
    cy.url().should('include', '/p/Jan/stream');
    cy.getCookie('Authentication').should('exist');
    cy.getCookie('Refresh').should('exist');
  });

  it('Successful Login - email', function () {
    cy.get('[data-id="login-usernameoremail"]').type('jan@test.com');
    cy.get('[data-id="btn-to-password"]').click();
    cy.get('[data-id="login-password"]').type('TestPassword123');
    cy.get('[data-id="btn-login"]').click();
    cy.url().should('include', '/p/Jan/stream');
    cy.getCookie('Authentication').should('exist');
    cy.getCookie('Refresh').should('exist');
  });

  it('Successful Login - enter', function () {
    cy.get('[data-id="login-usernameoremail"]').type('jan@test.com{enter}');
    cy.get('[data-id="login-password"]').type('TestPassword123{enter}');
    cy.url().should('include', '/p/Jan/stream');
    cy.getCookie('Authentication').should('exist');
    cy.getCookie('Refresh').should('exist');
  });
});
