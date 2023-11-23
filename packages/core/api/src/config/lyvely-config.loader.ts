import { ServerConfiguration } from './lyvely-config.types';
import { promises as fsPromises } from 'fs';
import { join, dirname, isAbsolute } from 'path';
import _ from 'lodash';
import { Logger } from '@nestjs/common';

const logger = new Logger('loadConfigs');

export const loadConfigs = (
  files: Array<string | Partial<ServerConfiguration>>,
): (() => Promise<ServerConfiguration>) => {
  const resolvePath = (file: string) => {
    if (isAbsolute(file)) {
      return file;
    }
    const basePath = require.main ? dirname(require.main.filename) : join(process.cwd(), 'dist');
    return join(basePath, file);
  };

  const importConfig = (path: string) => {
    logger.log('Load config from ' + path);
    const importPath = path.substring(0, path.lastIndexOf('.')) + '.js';
    return fsPromises
      .access(importPath)
      .then(() => import(importPath))
      .then((module) => module.default);
  };

  return () => {
    const configPromises = files.map((config) =>
      typeof config === 'string' ? importConfig(resolvePath(config)) : Promise.resolve(config),
    );

    return Promise.all(configPromises)
      .then((configs) => configs.reduce((acc, config) => _.merge(acc, config), {}))
      .catch((error) => {
        throw new Error(`An error occurred while loading configurations: ${error.message}`);
      });
  };
};
