import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = 'lyvely.ts';

export default (file = YAML_CONFIG_FILENAME): (() => Promise<Record<string, any>>) => {
  const filePath = join(process.env.PWD, 'dist/config', file);
  if(file.endsWith('.yml')) {
    return () => yaml.load(readFileSync(filePath, 'utf8'));
  } else if(file.endsWith('.js') || file.endsWith('.ts')) {
    return () => import(filePath.substring(0, filePath.lastIndexOf(".")) + ".js").then(module => module.default);
  }
};
