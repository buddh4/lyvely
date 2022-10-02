describe('Test Register Users', function () {
  const SELECTOR_ARCHIVE_BUTTON = '#filter-archive';

  beforeEach(() => {
    cy.task('db:seed');
    cy.login();
    cy.visit('/activities/habits');
  });

  it('archive habit entry', () => {
    cy.activityMenuItemShouldExist('Test Habit', 'Archive');
    cy.activityClickMenuItem('Test Habit', 'Archive');

    cy.activityShouldNotExists('Test Habit');

    // Make sure the newly archived habit is visible on filter
    cy.get(SELECTOR_ARCHIVE_BUTTON).click();

    cy.activityShouldExists('Test Habit', 'daily');
  });

  it('filter archived entries', () => {
    cy.activityShouldNotExists('Archived Habit');
    cy.get(SELECTOR_ARCHIVE_BUTTON).click();
    cy.activityShouldExists('Archived Habit', 'daily');
  });

  it('un-archived entry', () => {
    cy.get(SELECTOR_ARCHIVE_BUTTON).click();
    cy.activityClickMenuItem('Archived Habit', 'Restore');

    cy.activityShouldNotExists('Archived Habit');

    cy.get(SELECTOR_ARCHIVE_BUTTON).click();

    cy.activityShouldExists('Archived Habit');
  });

  it('archived entry not editable', () => {
    cy.get('#filter-archive').click();
    cy.activityMenuItemShouldNotExist('Archived Habit', 'Archive');
    cy.activityMenuItemShouldNotExist('Archived Habit', 'Edit');
    cy.activityMenuItemShouldExist('Archived Habit', 'Restore');
    cy.getActivity('Archived Habit').find('.form-check-input:not(:disabled)').should('have.length', 0);

    cy.getActivity('Archived Habit').find('[type="checkbox"]:disabled').should('have.length', 5);
  });
});
