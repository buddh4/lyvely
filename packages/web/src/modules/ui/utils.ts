export const SELECTOR_FORM_FIELD = 'input,textarea,select';
export const SELECTOR_FOCUSABLE = SELECTOR_FORM_FIELD+',button,object,[href],[tabindex]';

export function findFirstInput(root?: HTMLElement|null) {
  return <HTMLElement|undefined> root?.querySelector(SELECTOR_FORM_FIELD);
}

export function isFocusable(root?: HTMLElement|null) {
  return !!root?.matches(SELECTOR_FOCUSABLE);
}

export function findFocusable(root?: HTMLElement|null) {
  debugger;
  return _ifFocusable(root) || root?.querySelector<HTMLElement>(SELECTOR_FOCUSABLE);
}

export function suggestFocusElement(root?: HTMLElement|null) {
  return findFirstInput(root) || _ifFocusable(root, 'h1') || _ifFocusable(root);
}

function _ifFocusable(root?: HTMLElement|null, selector?: string) {
  const elem = selector ? root?.querySelector<HTMLElement>(selector) : root;
  return isFocusable(elem) ? elem : null;
}

export function includesUtilityClass(classNames: string, prefix: string) {
  return new RegExp(`^.*${prefix}-\\d`).test(classNames);
}

/*!
 * Get the contrasting color for any hex color
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * Derived from work by Brian Suda, https://24ways.org/2010/calculating-color-contrast/
 * @param  {String} A hexcolor value
 * @return {String} The contrasting color (black or white)
 */
export function getContrast(hexcolor: string): 'black'|'white' {

  // If a leading # is provided, remove it
  if (hexcolor.slice(0, 1) === '#') {
    hexcolor = hexcolor.slice(1);
  }

  // If a three-character hexcode, make six-character
  if (hexcolor.length === 3) {
    hexcolor = hexcolor.split('').map(function (hex) {
      return hex + hex;
    }).join('');
  }

  // Convert to RGB value
  const r = parseInt(hexcolor.substr(0,2),16);
  const g = parseInt(hexcolor.substr(2,2),16);
  const b = parseInt(hexcolor.substr(4,2),16);

  // Get YIQ ratio
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

  // Check contrast
  return (yiq >= 128) ? 'black' : 'white';

};
