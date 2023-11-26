describe('Test Register Users', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.task('mails:delete');
  });

  afterEach(() => {
    cy.reload();
  });

  it('Successful sign-up - remember me', function () {
    cy.visit('http://127.0.0.1:3000/sign-up');
    cy.get('[data-id="user-registration-username"]').type('NewUser');
    cy.get('[data-id="user-registration-email"]').type('newUser@test.de');
    cy.get('[data-id="user-registration-password"]').type('testPassword');
    cy.get('[data-id="user-registration-passwordrepeat"]').type('testPassword');
    cy.get('[data-id="user-registration-remember"]').click();
    cy.get('[data-id="btn-submit"]').click();

    cy.url().should('include', '/verify-email');

    cy.task('mails:extract', '^[0-9]{6}').then((result: string[]) => {
      cy.wrap(result[0].split('')).each((digit: string, index: number) => {
        cy.get(`[data-id="otp-${index}"]`).type(digit);
      });
    });

    cy.get('[data-id="btn-submit"]').click();

    // Greeting system message
    cy.contains("Great job! You've successfully created your first private profile.");
    // Help modal
    cy.contains('Welcome to Lyvely e2e');
    cy.getCookie('Authentication').should('exist');
    cy.getCookie('Refresh').should('exist');
    cy.getCookie('Refresh')
      .then((cookie) => cy.task('jwt:decode', cookie.value))
      .then((payLoad: any) => cy.wrap(payLoad.remember).should('equal', false));
  });

  it('Successful sign-up', function () {
    cy.visit('http://127.0.0.1:3000/sign-up');
    cy.get('[data-id="user-registration-username"]').type('NewUser');
    cy.get('[data-id="user-registration-email"]').type('newUser@test.de');
    cy.get('[data-id="user-registration-password"]').type('testPassword');
    cy.get('[data-id="user-registration-passwordrepeat"]').type('testPassword');
    cy.get('[data-id="btn-submit"]').click();

    cy.url().should('include', '/verify-email');

    cy.task('mails:extract', '^[0-9]{6}').then((result: string[]) => {
      cy.wrap(result[0].split('')).each((digit: string, index: number) => {
        cy.get(`[data-id="otp-${index}"]`).type(digit);
      });
    });

    cy.get('[data-id="btn-submit"]').click();

    // Greeting system message
    cy.contains("Great job! You've successfully created your first private profile.");
    // Help modal
    cy.contains('Welcome to Lyvely e2e');
    cy.getCookie('Authentication').should('exist');
    cy.getCookie('Refresh').should('exist');
    cy.getCookie('Refresh')
      .then((cookie) => cy.task('jwt:decode', cookie.value))
      .then((payLoad: any) => cy.wrap(payLoad.remember).should('equal', false));
  });

  it('Failed sign-up - invalid password repeat', function () {
    cy.visit('http://127.0.0.1:3000/sign-up');
    cy.get('[data-id="user-registration-username"]').type('NewUser');
    cy.get('[data-id="user-registration-email"]').type('newUser@test.com');
    cy.get('[data-id="user-registration-password"]').type('testPassword');
    cy.get('[data-id="user-registration-passwordrepeat"]').type('testPassword2{enter}');
    cy.get('[data-id="btn-submit"]').click();
    cy.contains('Repeat password must equal Password');
  });

  it('Failed sign-up - username taken', function () {
    cy.visit('http://127.0.0.1:3000/sign-up');
    cy.get('[data-id="user-registration-username"]').type('Jan');
    cy.get('[data-id="user-registration-email"]').type('newUser@test.de');
    cy.get('[data-id="user-registration-password"]').type('testPassword');
    cy.get('[data-id="user-registration-passwordrepeat"]').type('testPassword{enter}');
    cy.get('[data-id="btn-submit"]').click();
    cy.contains('Username is already taken');
  });

  it('Failed sign-up - email taken', function () {
    cy.visit('http://127.0.0.1:3000/sign-up');
    cy.get('[data-id="user-registration-username"]').type('NewUser');
    cy.get('[data-id="user-registration-email"]').type('jan@test.com');
    cy.get('[data-id="user-registration-password"]').type('testPassword');
    cy.get('[data-id="user-registration-passwordrepeat"]').type('testPassword{enter}');
    cy.get('[data-id="btn-submit"]').click();
    cy.contains('Email is already taken');
  });
});
