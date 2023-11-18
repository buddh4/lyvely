describe('Test Register Users', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.visit('http://127.0.0.1:3000/logout');
  });

  afterEach(() => {
    cy.reload();
  });

  it('Successful Login', function () {
    cy.get('[data-id="login-usernameoremail"]').type('Jan');
    cy.get('[data-id="btn-to-password"]').click();
    cy.get('[data-id="login-password"]').type('TestPassword123');
    cy.get('[data-id="btn-login"]').click();
    cy.url().should('include', '/p/Jan/stream');
  });

  it('greeting and content', () => {
    cy.contains('h1', 'Sign in');
    cy.contains('Sign up').should('have.attr', 'href', '/register');
  });

  it('requires username', () => {
    cy.get('[data-id="btn-submit"]').click();
    cy.get('.text-danger').should('contain', 'Username or Email is required');
  });

  /* it('Failed Login - Incorrect Password', function () {
    cy.get('#login-username').type('Jan');
    cy.get('#login-password').type('test2{enter}');
    cy.url()
      .should('include', '/login')
      .should(() => expect(localStorage.getItem('user-token')).to.not.exist);
    cy.contains('Invalid username or password.');
  });

  it('Login unknown user', function () {
    cy.get('#login-username').type('NotExisting');
    cy.get('#login-password').type('test{enter}');
    cy.url()
      .should('include', '/login')
      .should(() => expect(localStorage.getItem('user-token')).to.not.exist);
    cy.contains('Invalid username or password.');
  });



  it('Logout user successfully', function () {
    cy.get('#login-username').type('Jan');
    cy.get('#login-password').type('test{enter}');
    cy.visit('http://localhost:3000/logout');
    cy.url()
      .should('include', '/login')
      .should(() => expect(localStorage.getItem('user-token')).to.not.exist);
  });*/
});
