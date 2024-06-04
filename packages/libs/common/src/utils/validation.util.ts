import { isPlainObject } from './object.util';

export const REGEX_HEX_COLOR = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
import { getMetadataStorage, isEmail } from 'class-validator';

export function applyValidationProperties<T>(
  model: T,
  data: { [key in keyof T]?: any },
  level = 0,
  { maxDepth = 100 } = {}
): T {
  if (level > maxDepth) return model;

  const validationFields = getValidationFields(model);

  Object.keys(data).forEach((key) => {
    const property = key as keyof T;
    if (!Array.isArray(model) && !validationFields.has(property)) {
      return;
    }

    if (Array.isArray(data[property])) {
      model[property] = applyValidationProperties<any>([], data[property], level + 1, { maxDepth });
    } else if (isPlainObject(model[property]) && isPlainObject(data[property])) {
      model[property] = applyValidationProperties(model[property], data[property], level + 1, {
        maxDepth,
      });
    } else {
      model[property] = data[property];
    }
  });

  return model;
}

export function getValidationFields<T>(model: T) {
  if (Array.isArray(model) || !model?.constructor?.name) return new Set();
  const validationMetas = getMetadataStorage().getTargetValidationMetadatas(
    model.constructor,
    model.constructor.name,
    true,
    false
  );
  return new Set(validationMetas?.map((meta) => meta.propertyName) || []);
}

export function isValidEmail(email: string) {
  return isEmail(email);
}

export type GUID = 'md5' | 'sha256';

/**
 * Determines whether the given string is a valid GUID (Globally Unique Identifier).
 * If an algorithm of 'md5' or 'sha256' is given this function also validates the guid length.
 *
 * @param {string} guid - The string to be checked for GUID format.
 * @param {string} algo - Optional. The algorithm to use for validation. Valid options are 'md5', 'sha256' or undefined.
 * @return {boolean} - Returns true if the string is a valid GUID, otherwise returns false.
 */
export function isGuid(guid: string, algo?: GUID) {
  if (!algo) return /^[A-Fa-f0-9]{1,64}$/.test(guid);
  return algo === 'md5' ? /^[A-Fa-f0-9]{32}$/.test(guid) : /^[A-Fa-f0-9]{64}$/.test(guid);
}

export const escapeHTML = (str: string) => {
  if (!str) {
    return;
  }

  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      })[tag] || ''
  );
};
