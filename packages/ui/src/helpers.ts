import { escapeRegExp } from 'lodash';

export function includesUtilityClass(classNames: string, prefix: string) {
  return new RegExp(`^.*${escapeRegExp(prefix)}-[a-z0-9]`).test(classNames);
}
