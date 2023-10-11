import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { LyvelyAppConfiguration } from '@/core';

const YAML_CONFIG_FILENAME = 'lyvely.ts';

export const loadConfig = (
  file = YAML_CONFIG_FILENAME,
): (() => Promise<LyvelyAppConfiguration>) => {
  // Todo: switch to process.cwd()?
  const filePath = join(process.env.PWD!, 'dist/config', file);
  if (file.endsWith('.yml')) {
    return () => yaml.load(readFileSync(filePath, 'utf8'));
  }

  return () =>
    import(filePath.substring(0, filePath.lastIndexOf('.')) + '.js').then(
      (module) => module.default,
    );
};
