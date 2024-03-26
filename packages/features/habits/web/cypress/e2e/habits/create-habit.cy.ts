describe('Create Habit', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  it('Create checkbox habit', () => {
    cy.authenticatedAs('owner');
    cy.loadProfile(`owner-profile/stream`);
    cy.getId('btn-stream-add').click();
    cy.getId('btn-content-type-habit').click();
    cy.getId('habit-form-title').type('Sport');
    cy.getId('habit-form-max').clear().type('5');
    cy.getId('habit-form-min').clear().type('2');
    cy.getId('habit-form-optimal').clear().type('3');
    cy.getId('habit-form-score').clear().type('5');
    cy.getId('tag-picker1').click();
    cy.get('[data-badge-selection="Health"]').click();
    cy.getId('tag-picker1-modal').find('[data-id="btn-modal-submit"]').click();
    cy.getId('habit-form-text').type('Do some sport!');
    cy.getId('btn-modal-submit').click();

    cy.get('[data-stream-entry]').contains('Do some sport!');
    cy.get('[data-stream-entry]').contains('Sport');
    cy.get('[data-stream-entry]').last().contains('Health');
    cy.get('[data-stream-entry]').last().find('[data-id^=body-]').click();
  });
});
