/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

require('dotenv').config({ path: '.e2e.env' });
const path = require('path');
const { Seeder } = require('mongo-seeding');

async function seed(cfg) {
  const config = {
    database: cfg.env.MONGODB_URI,
    dropDatabase: false,
    dropCollections: false,
    removeAllDocuments: true,
  };

  const seeder = new Seeder(config);
  const collections = seeder.readCollectionsFromPath(path.resolve('./cypress/data'), {
    transformers: [
      //Seeder.Transformers.replaceDocumentIdWithUnderscoreId,
      Seeder.Transformers.setCreatedAtTimestamp,
      Seeder.Transformers.setUpdatedAtTimestamp,
    ],
  });

  await seeder.import(collections);
  return true;
}

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `config` is the resolved Cypress config
  config.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/lyvely-e2e';

  // `on` is used to hook into various events Cypress emits
  on('task', {
    'db:seed': () => seed(config),
  });

  return config;
};
