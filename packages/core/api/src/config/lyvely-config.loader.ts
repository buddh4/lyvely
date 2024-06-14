import { ServerConfiguration } from './lyvely-config.types';
import { promises as fsPromises } from 'fs';
import { join, dirname, isAbsolute } from 'path';
import _ from 'lodash';
import { Logger } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { COLLECTION_CONFIG } from './config.constants';

const logger = new Logger('loadConfigs');

export const loadConfigs = (
  files: Array<string | Partial<ServerConfiguration>>,
  withDbConfig?: boolean
): (() => Promise<ServerConfiguration>) => {
  const resolvePath = (file: string) => {
    if (isAbsolute(file)) {
      return file;
    }
    const basePath = require.main ? dirname(require.main.filename) : join(process.cwd(), 'dist');
    return join(basePath, file);
  };

  const importConfig = (path: string) => {
    const importPath = path.substring(0, path.lastIndexOf('.')) + '.js';
    logger.log('Load config from ' + importPath);
    return fsPromises
      .access(importPath)
      .then(() => import(importPath))
      .then((module) => module.default);
  };

  const loadDbConfig = async (
    mergedConfig: ServerConfiguration
  ): Promise<Partial<ServerConfiguration>> => {
    if (!mergedConfig.mongodb) {
      logger.warn('Could not load db configuration, no mongodb options configured...');
      return {};
    }

    const { uri, dbName } = mergedConfig.mongodb;
    logger.log(`Load db config from uri: ${uri} dbName: ${dbName}`);
    const client = new MongoClient(uri);

    try {
      await client.connect();
      // The URI contains the database name, so we can use it directly to get the database object
      const database = dbName ? client.db(dbName) : client.db();
      const collection = database.collection<Partial<ServerConfiguration>>(COLLECTION_CONFIG);
      const dbConfig = await collection.findOne();
      return dbConfig || {};
    } finally {
      await client.close();
    }
  };

  return () => {
    const configPromises = files.map((config) =>
      typeof config === 'string' ? importConfig(resolvePath(config)) : Promise.resolve(config)
    );

    return Promise.all(configPromises)
      .then((configs) => configs.reduce((acc, config) => _.merge(acc, config), {}))
      .then((mergedConfig) =>
        withDbConfig
          ? loadDbConfig(mergedConfig).then((dbConfig) => ({ dbConfig, mergedConfig }))
          : { dbConfig: {}, mergedConfig }
      )
      .then(({ dbConfig, mergedConfig }) => _.merge({}, mergedConfig, dbConfig))
      .catch((error) => {
        throw new Error(`An error occurred while loading configurations: ${error.message}`);
      });
  };
};
