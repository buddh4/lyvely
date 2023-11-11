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

export function getContrast(hexColor: string): 'dark' | 'light' {
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
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  // Adjusted YIQ formula for RGB color space
  const yiq = (r * 0.299 + g * 0.587 + b * 0.114);

  return yiq >= 128 ? 'dark' : 'light';
}


export type VIEW_SIZE = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const SIZES = {
  sm: { min: 0, max: 767 },
  md: { min: 768, max: 1023 },
  lg: { min: 1024, max: 1289 },
  xl: { min: 1280, max: 1535 },
  '2xl': { min: 1536, max: Number.MAX_VALUE },
};

export function isMaxViewSize(size: VIEW_SIZE) {
  return window.matchMedia(`(max-width: ${SIZES[size].max}px )`).matches;
}

export function isTouchScreen() {
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

export function focusIfNotTouchScreen(elem?: HTMLElement) {
  if (elem && !isTouchScreen()) elem.focus();
}

export function watchMaxSize(size: VIEW_SIZE, listener: (x: boolean) => void) {
  return window
    .matchMedia(`(max-width: ${SIZES[size].max}px )`)
    .addEventListener('change', (x) => listener(x.matches));
}
