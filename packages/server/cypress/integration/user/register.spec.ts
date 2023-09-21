describe('Test Register Users', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.visit('http://localhost:3000/logout');
  });

  afterEach(() => {
    cy.reload();
  });

  it('Register user username taken', function () {
    cy.visit('http://localhost:3000/register');
    cy.get('#registerUsername').type('Jan');
    cy.get('#registerEmail').type('jansOtherMail@test.de');
    cy.get('#registerPassword').type('testPassword{enter}');
    cy.contains('Username Jan is already registered');
  });

  it('Register user username taken (case sensitive)', function () {
    cy.visit('http://localhost:3000/register');
    cy.get('#registerUsername').type('jan');
    cy.get('#registerEmail').type('jansOtherMail@test.de');
    cy.get('#registerPassword').type('testPassword{enter}');
    cy.contains('Username jan is already registered');
  });

  it('Register user email taken', function () {
    cy.visit('http://localhost:3000/register');
    cy.get('#registerUsername').type('Janxy');
    cy.get('#registerEmail').type('jan@test.com');
    cy.get('#registerPassword').type('testPassword{enter}');
    cy.contains('e-mail jan@test.com is already registered');
  });

  it('Register user email taken (case sensitive)', function () {
    cy.visit('http://localhost:3000/register');
    cy.get('#registerUsername').type('Janxy');
    cy.get('#registerEmail').type('Jan@test.com');
    cy.get('#registerPassword').type('testPassword{enter}');
    cy.contains('e-mail Jan@test.com is already registered');
  });

  // TODO: password complexity
  // TODO: Locked delted account

  it('Register user successfully', function () {
    cy.visit('http://localhost:3000');
    cy.contains('Sign up').click();
    cy.get('#registerUsername').type('Buddha');
    cy.get('#registerEmail').type('buddha@test.de');
    cy.get('#registerPassword').type('testPassword{enter}');

    // TODO: registration confirm message

    cy.url().should('include', '/login');

    // TODO: confirm by email

    cy.get('#login-username').type('Buddha');
    cy.get('#login-password').type('testPassword');
    cy.get('[type="submit"]').click();
    cy.url().should('include', '/activities');
  });
});