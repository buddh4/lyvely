describe('Test Register Users', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.login();
    cy.visit('/activities/habits');
  });

  it('edit habit title', () => {
    cy.activityClickMenuItem('Test Habit', 'Edit');
    cy.modalHeaderShouldContain('Edit activity');

    cy.get('[data-habit-title] input').type('{selectall}Edited Habit Title');
    cy.modalSubmit();

    cy.activityShouldExists('Edited Habit Title', 'daily');
  });

  it('edit rating', () => {
    cy.activityClickMenuItem('Test Habit', 'Edit');

    cy.get('[data-habit-rating-max] input').type('{selectall}3');
    cy.get('[data-habit-rating-min] input').type('{selectall}1');
    cy.get('[data-habit-rating-optimal] input').type('{selectall}2');

    cy.modalSubmit();

    cy.activityHasCheckboxes('Test Habit', 3);
    cy.activityHasCheckboxes('Test Habit', 1, 'min');
    cy.activityHasCheckboxes('Test Habit', 1, 'optimal');
    cy.activityHasCheckboxes('Test Habit', 1, 'none');
  });
});
