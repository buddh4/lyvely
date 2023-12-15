describe('Content stream filter', function () {
  beforeEach(() => {
    cy.task('db:seed');
  });

  it('User can filter stream by tag.', () => {
    cy.authenticatedAs('owner');
    cy.loadProfile(`owner-profile/stream`);
    cy.task('db:getObjectId', 'tag-health').then((objectId: string) => {
      cy.getId('stream-filter-nav').find(`[data-tag-id="${objectId}"]`).click();
    });
    cy.getByObjectId('owner-profile-tagged').should('exist');
    cy.getByObjectId('owner-profile-first').should('not.exist');
  });

  it('Filter by url works.', () => {
    cy.authenticatedAs('owner');
    cy.task('db:getObjectId', 'tag-health').then((objectId: string) => {
      cy.loadProfile(`owner-profile/stream`, null, {
        qs: { tagIds: objectId },
      });
    });

    cy.getByObjectId('owner-profile-tagged').should('exist');
    cy.getByObjectId('owner-profile-first').should('not.exist');

    cy.task('db:getObjectId', 'tag-health').then((objectId: string) => {
      cy.getId('stream-filter-nav').find(`[data-tag-id="${objectId}"]`).click();
    });

    cy.getByObjectId('owner-profile-tagged').should('exist');
    cy.getByObjectId('owner-profile-first').should('exist');
  });
});
