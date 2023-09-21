/*describe('Test Register Users', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.login();
    cy.visit('/activities/habits');
  });

  it('add simple habit', () => {
    cy.get('#activity-overview .btn-add').click();
    cy.get('[data-modal-header]').should('contain', 'Add activity');
    cy.get('[data-habit-title] input').type('My new habit');
    cy.get('[data-habit-rating-max] input').type('{selectall}3');
    cy.get('[data-habit-rating-min] input').clear().type('{selectall}1');
    cy.get('[data-habit-rating-value] input').clear().type('{selectall}2');
    cy.get('[data-habit-rating-optimal] input').clear().type('{selectall}1');
    cy.modalSubmit();
    cy.activityShouldExists('My new habit');

    cy.activityHasCheckboxes('My new habit', 3);
  });

  // TODO: Auto input validation fix
});*/
