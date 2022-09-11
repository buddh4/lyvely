import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = 'lyvely.yml';

export default (file = YAML_CONFIG_FILENAME) => {
  return () => yaml.load(
    readFileSync(join(process.env.PWD, '/config', file), 'utf8'),
  ) as Record<string, any>;
};
