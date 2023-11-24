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

import fs, { readdirSync } from 'fs';

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

async function deleteMails() {
  // Specify the relative path to the directory
  const absoluteDirectoryPath = path.resolve(__dirname, '../mails');

  try {
    // Create the directory if it doesn't exist
    if (!fs.existsSync(absoluteDirectoryPath)) {
      fs.mkdirSync(absoluteDirectoryPath, { recursive: true });
    }

    // Use Node.js fs.readdir to get a list of files and subdirectories
    fs.readdirSync(absoluteDirectoryPath).forEach((file) => {
      const filePath = path.join(absoluteDirectoryPath, file);

      // Check if the file is an HTML file and delete it
      if (filePath.endsWith('.html')) {
        fs.unlinkSync(filePath);
      }
    });

    return true;
  } catch (err) {
    throw err;
  }
}

function getLatestMailContent(): string {
  try {
    const mailDir = path.resolve(__dirname, '../mails');
    const files = fs.readdirSync(mailDir);

    if (files.length === 0) {
      return '';
    }

    // Sort files by modification time in descending order
    const fileStats = files
      .filter((file) => file.endsWith('.html'))
      .map((file) => {
        const filePath = path.join(mailDir, file);
        const stat = fs.statSync(filePath);
        return { filePath, mtime: stat.mtime };
      });

    if (fileStats.length === 0) {
      return '';
    }

    fileStats.sort((a, b) => b.mtime - a.mtime);

    // Read the content of the latest file
    const latestFilePath = fileStats[0].filePath;
    return fs.readFileSync(latestFilePath, 'utf-8');
  } catch (error) {
    return error.message;
    console.error(`Error: ${error.message}`);
  }
}

function extractFromLatestMail(regex: string): string[] {
  try {
    const content = getLatestMailContent();
    if (!content) return null;

    const matches: string[] = [];
    let match: string[];

    // Create a regular expression object
    const regexObj = new RegExp(regex, 'g');

    while ((match = regexObj.exec(content)) !== null) {
      matches.push(match[1] || match[0]); // Capture group 1 or full match
    }

    return matches;
  } catch (error) {
    console.log(error);
    return [];
  }
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
    'mails:delete': () => deleteMails(),
    'mails:latest': () => getLatestMailContent(),
    'mails:extract': (regex: string) => extractFromLatestMail(regex),
  });

  return config;
};
