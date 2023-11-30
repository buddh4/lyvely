// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// eslint-disable-next-line @typescript-eslint/no-namespace
import { v4 as uuidv4 } from 'uuid';
import Loggable = Cypress.Loggable;
import Timeoutable = Cypress.Timeoutable;
import Withinable = Cypress.Withinable;
import VisitOptions = Cypress.VisitOptions;
import Shadow = Cypress.Shadow;

type Username = 'Jan' | 'Disabled';

Cypress.Commands.add('authenticatedAs', (username: Username) => {
  cy.task('auth:createAuthToken', username).then((token: string) => {
    console.log('test');
    cy.setCookie('Authentication', token, {
      sameSite: 'lax',
      httpOnly: true,
      secure: false,
    });
    window.localStorage.setItem('visitorId', uuidv4());
  });
});

Cypress.Commands.add(
  'getId',
  (dataId: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>) => {
    return cy.get(`[data-id="${dataId}"]`, options);
  },
);

Cypress.Commands.add(
  'getByObjectId',
  (
    seed: string,
    prefix: string,
    options?: Partial<Loggable & Timeoutable & Withinable & Shadow>,
  ) => {
    cy.task('db:getObjectId', seed).then((objectId: string) => {
      prefix = prefix ? prefix + '-' : '';
      cy.getId(prefix + objectId);
    });
  },
);

Cypress.Commands.add('load', (path: string, options?: Partial<VisitOptions>) => {
  path = path.startsWith('/') ? path : '/' + path;
  cy.visit(`http://127.0.0.1:3000${path}`, options);
});

Cypress.Commands.add(
  'loadProfile',
  (handle: string, path?: string, options?: Partial<VisitOptions>) => {
    path = path && path.startsWith('/') ? path : '/' + (path || '');
    cy.visit(`http://127.0.0.1:3000/p/${handle}${path}`, options);
  },
);

Cypress.Commands.add('isForbidden', (path?: string, options?: Partial<VisitOptions>) => {
  if (path) {
    cy.load(path, options);
  }
  cy.getId('layout-profile').should('not.exist');
  return cy.url().should('eq', 'http://127.0.0.1:3000/403');
});
