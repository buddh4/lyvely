describe('Test Register Users', function () {
  beforeEach(() => {
    cy.task('db:seed');
    cy.login();
    cy.visit('/activities/habits');
  });

  it('initial ui view', () => {
    cy.get('.sidebar .router-link-active').should('contain', 'Activities');
    cy.get('#sub-nav .active').should('contain', 'Activities');
    cy.get('#activity-overview [data-cid]').should('contain', 'Test Habit');

    // TODO: tags
  });
});
