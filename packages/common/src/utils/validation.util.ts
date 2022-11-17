export const REGEX_HEX_COLOR = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
import { getMetadataStorage, isEmail } from 'class-validator';

export function applyValidationProperties<T>(
  model: T,
  data: { [key in keyof T]?: any },
  level = 0,
  { maxDepth = 100 } = {},
): T {
  if (level > maxDepth) return model;

  const validationFields = getValidationFields(model);

  Object.keys(data).forEach((property) => {
    if (!Array.isArray(model) && !validationFields.has(property)) {
      return;
    }

    if (Array.isArray(data[property])) {
      model[property] = applyValidationProperties([], data[property], level + 1, { maxDepth });
    } else if (
      data[property] &&
      typeof data[property] === 'object' &&
      model[property] &&
      typeof model[property] === 'object'
    ) {
      model[property] = applyValidationProperties(model[property], data[property], level + 1, { maxDepth });
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
    false,
  );
  return new Set(validationMetas?.map((meta) => meta.propertyName) || []);
}

export function isValidEmail(email: string) {
  return isEmail(email);
}

export function isGuid(guid: string) {
  return /^[A-Fa-f0-9]{64}$/.test(guid);
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
      }[tag]),
  );
};
