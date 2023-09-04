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
import { Cookies } from '../../src/modules/core/web';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    login(): void;

    logout(): void;

    getActivity(title: string, plan?: Plan): Chainable;

    activityShouldExists(title: string, plan?: Plan);

    activityShouldNotExists(title: string, plan?: Plan);

    activityClickMenuItem(title: string, label: string);

    activityMenuItemShouldExist(title: string, label: string);

    activityMenuItemShouldNotExist(title: string, label: string);

    activityHasCheckboxes(
      title: string,
      count: number,
      type?: CheckboxType,
      checked?: boolean,
    ): void;

    modalHeaderShouldContain(title: string): void;

    modalSubmit(label?: string): void;
  }
}

type Plan = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'unscheduled';

type CheckboxType = 'optimal' | 'min' | 'danger' | 'none';

/**
 * USER
 */

Cypress.Commands.add('login', () => {
  cy.visit('/auth/login');
  cy.get('#login-username').type('Jan');
  cy.get('#login-password').type('test');
  cy.get('[type="submit"]').click();
  cy.url().should('include', '/activities/habits');
  cy.getCookie(Cookies.AUTHENTICATION).should('exist');
});

Cypress.Commands.add('logout', () => {
  cy.visit('/auth/logout');
  cy.url().should('include', '/auth/login');
  cy.getCookie(Cookies.AUTHENTICATION).should('not.exist');
});

const ACTIVITY_GROUP_ITEM_SELECTOR = '#activity-overview [data-cid]';

/**
 * Activity
 */

Cypress.Commands.add('activityShouldExists', (title, plan?: Plan) => {
  if (plan) {
    cy.get(ACTIVITY_GROUP_ITEM_SELECTOR)
      .contains(title)
      .closest('[data-calendar-item-container]')
      .prev('[data-calendar-header]')
      .should('have.class', `timing-${plan}`);
  } else {
    cy.get('.calendar-list').contains(title).should('exist');
  }
});

Cypress.Commands.add('activityShouldNotExists', (title, plan?: Plan) => {
  if (plan) {
    cy.get(ACTIVITY_GROUP_ITEM_SELECTOR)
      .contains(title)
      .closest('[data-calendar-item-container]')
      .prev('[data-calendar-header]')
      .should('not.have.class', `timing-${plan}`);
  } else {
    cy.get(ACTIVITY_GROUP_ITEM_SELECTOR).contains(title).should('not.exist');
  }
});

Cypress.Commands.add('getActivity', (title: string, plan?: Plan) => {
  let selector = ACTIVITY_GROUP_ITEM_SELECTOR;

  if (plan) {
    selector += `.timing-${plan}`;
  }

  return cy.get(selector).contains(title).closest('.calendar-list-item');
});

Cypress.Commands.add('activityClickMenuItem', (title, label) => {
  cy.get(ACTIVITY_GROUP_ITEM_SELECTOR)
    .contains(title)
    .closest('[data-cid]')
    .find('.dropdown button')
    .click({ force: true })
    .closest('.dropdown')
    .find('[aria-labelledby] a')
    .contains(label)
    .click();
});

Cypress.Commands.add('activityMenuItemShouldExist', (title, label) => {
  cy.get(ACTIVITY_GROUP_ITEM_SELECTOR)
    .contains(title)
    .closest('[data-cid]')
    .find('.dropdown button')
    .click({ force: true })
    .closest('.dropdown')
    .find('[aria-labelledby] a')
    .contains(label)
    .should('exist');

  cy.get(ACTIVITY_GROUP_ITEM_SELECTOR)
    .contains(title)
    .closest('[data-cid]')
    .find('.dropdown button')
    .click({ force: true });
});

Cypress.Commands.add('activityMenuItemShouldNotExist', (title, label) => {
  cy.get(ACTIVITY_GROUP_ITEM_SELECTOR)
    .contains(title)
    .closest('[data-cid]')
    .find('.dropdown button')
    .click({ force: true })
    .closest('.dropdown')
    .find('[aria-labelledby] a')
    .contains(label)
    .should('not.exist');

  cy.get(ACTIVITY_GROUP_ITEM_SELECTOR)
    .contains(title)
    .closest('[data-cid]')
    .find('.dropdown button')
    .click({ force: true });
});

Cypress.Commands.add(
  'activityHasCheckboxes',
  (title: string, count: number, type?: CheckboxType, checked?: boolean) => {
    let selector = '[type="checkbox"]';

    if (type === 'optimal') {
      selector += '.success';
    } else if (type === 'min') {
      selector += '.warning';
    } else if (type === 'danger') {
      selector += '.danger';
    } else if (type) {
      selector += ':not(.success):not(.warning):not(.danger)';
    }

    if (checked !== undefined) {
      const childSelector = checked ? '[value="1"]' : '[value="0"]';
      cy.get(ACTIVITY_GROUP_ITEM_SELECTOR)
        .contains(title)
        .closest('[data-cid]')
        .find(selector)
        .children(childSelector)
        .should('have.length', count);
    } else {
      cy.get(ACTIVITY_GROUP_ITEM_SELECTOR)
        .contains(title)
        .closest('[data-cid]')
        .find(selector)
        .should('have.length', count);
    }
  },
);

/**
 * Modal
 */
Cypress.Commands.add('modalHeaderShouldContain', (title: string) => {
  cy.get('[data-modal-header]:visible').should('contain', title);
});

Cypress.Commands.add('modalSubmit', (label = 'Send') => {
  cy.get('[data-modal-footer]:visible [data-modal-submit]').click();
});
