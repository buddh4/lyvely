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
import RequestBody = Cypress.RequestBody;

type Username = 'owner' | 'disabled' | 'moderator' | 'member' | 'no-member';

Cypress.Commands.add('authenticatedAs', (username: Username) => {
  cy.task<string>('auth:createAuthToken', username).then((token: string) => {
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
    prefix?: string,
    options?: Partial<Loggable & Timeoutable & Withinable & Shadow>,
  ) => {
    cy.task<string>('db:getObjectId', seed).then((objectId: string) => {
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

Cypress.Commands.add(
  'apiPost',
  (path: string, body?: RequestBody, options?: Partial<APIRequestOptions>) => {
    options ||= {};
    options.method = 'POST';
    return cy.apiRequest(path, body, options);
  },
);

Cypress.Commands.add(
  'apiPatch',
  (path: string, body?: RequestBody, options?: Partial<APIRequestOptions>) => {
    options ||= {};
    options.method = 'PATCH';
    return cy.apiRequest(path, body, options);
  },
);

Cypress.Commands.add(
  'apiPut',
  (path: string, body?: RequestBody, options?: Partial<APIRequestOptions>) => {
    options ||= {};
    options.method = 'PUT';
    return cy.apiRequest(path, body, options);
  },
);

Cypress.Commands.add('apiGet', (path: string, options?: Partial<APIRequestOptions>) => {
  options ||= {};
  options.method = 'GET';
  return cy.apiRequest(path, undefined, options);
});

Cypress.Commands.add('apiDelete', (path: string, options?: Partial<APIRequestOptions>) => {
  options ||= {};
  options.method = 'DELETE';
  return cy.apiRequest(path, undefined, options);
});

Cypress.Commands.add(
  'profileApiPost',
  (handle: string, path?: string, body?: RequestBody, options?: Partial<APIRequestOptions>) => {
    options ||= {};
    options.method = 'POST';
    return cy.profileApiRequest(handle, path, body, options);
  },
);

Cypress.Commands.add(
  'profileApiPatch',
  (handle: string, path?: string, body?: RequestBody, options?: Partial<APIRequestOptions>) => {
    options ||= {};
    options.method = 'PATCH';
    return cy.profileApiRequest(handle, path, body, options);
  },
);

Cypress.Commands.add(
  'profileApiPut',
  (handle: string, path?: string, body?: RequestBody, options?: Partial<APIRequestOptions>) => {
    options ||= {};
    options.method = 'PUT';
    return cy.profileApiRequest(handle, path, body, options);
  },
);

Cypress.Commands.add(
  'profileApiGet',
  (handle: string, path?: string, options?: Partial<APIRequestOptions>) => {
    options ||= {};
    options.method = 'GET';
    return cy.profileApiRequest(handle, path, undefined, options);
  },
);

Cypress.Commands.add(
  'profileApiDelete',
  (handle: string, path?: string, options?: Partial<APIRequestOptions>) => {
    options ||= {};
    options.method = 'DELETE';
    return cy.profileApiRequest(handle, path, undefined, options);
  },
);

Cypress.Commands.add(
  'profileApiRequest',
  (handle: string, path?: string, body?: RequestBody, options?: Partial<APIRequestOptions>) => {
    return cy.task<string>('db:getObjectId', handle).then((objectId: string) => {
      path = path && path.startsWith('/') ? path : '/' + (path || '');
      return cy.apiRequest(`profiles/${objectId}${path}`, body, options);
    });
  },
);

Cypress.Commands.add(
  'apiRequest',
  (path: string, body?: RequestBody, options?: Partial<APIRequestOptions>) => {
    path = path && path.startsWith('/') ? path : '/' + (path || '');
    options = { ...options };
    options.url = `http://127.0.0.1:8080/api${path}`;
    options.body = body;
    options.headers ||= {} ;
    (<any>options.headers)['x-api-version'] ??= '1';
    options.failOnStatusCode = false;

    if (!options.as) {
      (<any>options.headers)['x-visitor-access'] = '1';
    } else {
      cy.authenticatedAs(options.as);
    }

    return cy.request(options);
  },
);

Cypress.Commands.add('isForbidden', (path?: string, options?: Partial<VisitOptions>) => {
  if (path) {
    cy.load(path, options);
  }
  cy.getId('layout-profile').should('not.exist');
  return cy.url().should('eq', 'http://127.0.0.1:3000/403');
});
