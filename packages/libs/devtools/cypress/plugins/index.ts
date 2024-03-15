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
import { sign, decode, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

const { getObjectId } = require('mongo-seeding');

dotenv.config({ path: '.e2e.env' });
const path = require('path');
const { Seeder } = require('mongo-seeding');

async function seed() {
  console.log('Seeding ' + process.env.MONGODB_URI_E2E);
  const config = {
    database: process.env.MONGODB_URI_E2E,
    dropDatabase: false,
    dropCollections: false,
    removeAllDocuments: true,
  };

  const seeder = new Seeder(config);
  const collections = seeder.readCollectionsFromPath(path.resolve(__dirname, '../data'), {
    transformers: [
      //Seeder.Transformers.replaceDocumentIdWithUnderscoreId,
      Seeder.Transformers.setCreatedAtTimestamp,
      Seeder.Transformers.setUpdatedAtTimestamp,
    ],
  });

  const localPath = path.resolve('./cypress/data');

  if (typeof localPath === 'string' && fs.existsSync(localPath)) {
    collections.push(
      ...seeder.readCollectionsFromPath(localPath, {
        transformers: [
          //Seeder.Transformers.replaceDocumentIdWithUnderscoreId,
          Seeder.Transformers.setCreatedAtTimestamp,
          Seeder.Transformers.setUpdatedAtTimestamp,
        ],
      }),
    );
  }

  await seeder.import(collections);
  return true;
}

async function deleteMails() {
  // Specify the relative path to the directory
  const absoluteDirectoryPath = path.resolve('./cypress/mails');

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
    const mailDir = path.resolve('./cypress/mails');
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

    fileStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

    // Read the content of the latest file
    const latestFilePath = fileStats[0].filePath;
    return fs.readFileSync(latestFilePath, 'utf-8');
  } catch (error) {
    return (<any>error).message;
  }
}

function extractFromLatestMail(regex: string, flags: string): string[] {
  try {
    const content = getLatestMailContent();
    if (!content) return [];

    const matches: string[] = [];
    let match: RegExpExecArray | null;

    // Create a regular expression object
    const regexObj = new RegExp(regex, flags || 'gm');

    while ((match = regexObj.exec(content)) !== null) {
      matches.push(match[1] || match[0]); // Capture group 1 or full match
    }

    return matches;
  } catch (error) {
    console.log(error);
    return [];
  }
}

function createAuthToken(username: string): string {
  const payload = { sub: getObjectId(username).toString(), purpose: 'jwt-access-token' };
  return sign(payload, 'e5d2ece45d3b7919fc7b6a8f19abc0cb7916c71bef385ca11f27a0a3b324e3d2', {
    expiresIn: '30m',
    algorithm: 'HS256',
  });
}

function decodeJwt(token: string): JwtPayload {
  return decode(token, { json: true }) as JwtPayload;
}

function _getObjectId(seed: string): string {
  return getObjectId(seed);
}

/**
 * @type {Cypress.PluginConfig}
 */
export default (on: any, config: any) => {
  // `config` is the resolved Cypress config
  config.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/lyvely-e2e';

  // `on` is used to hook into various events Cypress emits
  on('task', {
    'db:seed': () => seed(),
    'db:getObjectId': (seed: string) => _getObjectId(seed),
    'auth:createAuthToken': (username: string) => createAuthToken(username),
    'jwt:decode': (token: string) => decodeJwt(token),
    'mails:delete': () => deleteMails(),
    'mails:latest': () => getLatestMailContent(),
    'mails:extract': (regex: string, flags: string) => extractFromLatestMail(regex, flags),
  });

  return config;
};
