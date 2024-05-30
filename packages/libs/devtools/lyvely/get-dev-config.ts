import { lyvelyDevConfig } from './lyvely-dev.config';
import { lyvelyE2EConfig } from './lyvely-e2e.config';
import * as process from 'process';

export function getDevConfig() {
  return process.env.NODE_ENV === 'e2e' ? lyvelyE2EConfig : lyvelyDevConfig;
}
