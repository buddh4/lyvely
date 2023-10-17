import { ServerConfiguration } from '@/core';
import { join } from 'path';

export const loadConfig = (file: string): (() => Promise<ServerConfiguration>) => {
  // Todo: switch to process.cwd()?

  const path = join(process.env.PWD!, 'dist', file);

  return () =>
    import(path.substring(0, path.lastIndexOf('.')) + '.js').then((module) => module.default);
};
