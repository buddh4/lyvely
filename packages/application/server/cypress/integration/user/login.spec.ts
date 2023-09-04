describe('Test Register Users', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.visit('http://localhost:3000/logout');
  });

  afterEach(() => {
    cy.reload();
  });

  it('greeting and content', () => {
    cy.contains('h2', 'Sign In');
    cy.contains('Register').should('have.attr', 'href', '/register');
  });

  it('requires username and password', () => {
    cy.get('[type="submit"]').click();
    cy.get('.text-danger').should('contain', 'Username is required.');
    cy.get('.text-danger').should('contain', 'Password is required.');
  });

  it('requires username', () => {
    cy.get('#login-password').type('Jan{enter}');
    cy.get('.text-danger').should('contain', 'Username is required.');
  });

  it('requires password', () => {
    cy.get('#login-username').type('Jan{enter}');
    cy.get('.text-danger').should('contain', 'Password is required.');
  });

  it('Login user with wrong password', function () {
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

  it('Login user successfully', function () {
    cy.get('#login-username').type('Jan');
    cy.get('#login-password').type('test');
    cy.get('[type="submit"]').click();
    cy.url().should('include', '/activities/habits');
  });

  it('Logout user successfully', function () {
    cy.get('#login-username').type('Jan');
    cy.get('#login-password').type('test{enter}');
    cy.visit('http://localhost:3000/logout');
    cy.url()
      .should('include', '/login')
      .should(() => expect(localStorage.getItem('user-token')).to.not.exist);
  });
});