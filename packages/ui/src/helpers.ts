import { escapeRegExp } from 'lodash';

export const SELECTOR_FORM_FIELD = 'input,textarea,select';
export const SELECTOR_FOCUSABLE = SELECTOR_FORM_FIELD + ',button,object,[href],[tabindex]';

export function findFirstInput(root?: HTMLElement | null) {
  return <HTMLElement | undefined>root?.querySelector(SELECTOR_FORM_FIELD);
}

export function isFormField(elem?: HTMLElement | null) {
  return !!elem?.matches(SELECTOR_FORM_FIELD);
}

export function isFocusable(root?: HTMLElement | null) {
  return !!root?.matches(SELECTOR_FOCUSABLE);
}

export function findFocusable(root?: HTMLElement | null) {
  return _ifFocusable(root) || root?.querySelector<HTMLElement>(SELECTOR_FOCUSABLE);
}

export function suggestFocusElement(root?: HTMLElement | null) {
  return findFirstInput(root) || _ifFocusable(root, 'h1') || _ifFocusable(root);
}

function _ifFocusable(root?: HTMLElement | null, selector?: string) {
  const elem = selector ? root?.querySelector<HTMLElement>(selector) : root;
  return isFocusable(elem) ? elem : null;
}

export function includesUtilityClass(classNames: string, prefix: string) {
  return new RegExp(`^.*${escapeRegExp(prefix)}-[a-z0-9]`).test(classNames);
}

export function getContrast(hexColor: string): 'black' | 'white' {
  hexColor = hexColor.replace('#', '');

  if (hexColor.length === 3) {
    hexColor = hexColor
      .split('')
      .map(function (hex) {
        return hex + hex;
      })
      .join('');
  }

  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 2), 16);
  const b = parseInt(hexColor.substring(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
}
