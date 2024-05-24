import { useLyvelyApp } from './use-lyvely-app.helper';

/**
 * Checks if the current environment is a development environment.
 *
 * Note, this function should only be called once the Lyvely App was instantiated.
 *
 * @return {boolean} Returns true if the current environment is a development environment, otherwise returns false.
 */
export function isDevelopEnvironment() {
  return useLyvelyApp().options.env === 'development';
}
