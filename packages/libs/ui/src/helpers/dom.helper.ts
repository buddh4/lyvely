export function hasOverflow(elem: HTMLElement) {
  return elem.scrollHeight > elem.clientHeight || elem.scrollWidth > elem.clientWidth;
}

export function scrollToTop(elem: HTMLElement) {
  elem.scrollTop = 0;
}

export function scrollToBottom(elem: HTMLElement) {
  elem.scrollTop = elem.scrollHeight;
}

export function isScrolledToTop(elem: HTMLElement) {
  return elem.scrollTop === 0;
}

export function isScrolledToBottom(elem: HTMLElement) {
  return elem.scrollTop === elem.scrollHeight - elem.offsetHeight;
}

export function isTextSelection() {
  const selection = window.getSelection();
  return selection && selection.type === 'Range';
}

/**
 * Finds the closest parent element of the given element that matches the specified CSS selector including itself.
 *
 * @param {HTMLElement | null | undefined} element - The element to start the search from.
 * @param {string} selector - The CSS selector to match the parent element with.
 * @returns {HTMLElement | null} - The closest parent element that matches the selector, or null if no match is found.
 */
export function findParent(
  element: HTMLElement | null | undefined,
  selector: string
): HTMLElement | null {
  if (!element) return null;
  if (element.matches(selector)) return element;
  return element.parentNode && findParent(element.parentElement, selector);
}

/**
 * Finds the first HTML element within a given element, including itself, matching the specified selector.
 * Returns null if the given element is null or if no matching element is found.
 *
 * @param {HTMLElement | null | undefined} element - The element within which to search.
 * @param {string} selector - The CSS selector to match against.
 * @return {HTMLElement | null} The first HTML element matching the selector, or null if not found.
 */
export function findFirst(
  element: HTMLElement | null | undefined,
  selector: string
): HTMLElement | null {
  if (!element) return null;
  if (element.matches(selector)) return element;
  return element.querySelector(selector);
}

/**
 * Tries to determine a background color from its ancestors.
 * @param element
 */
export function getBackgroundColor(element: HTMLElement): string | null {
  let parentElement = element.parentElement;
  while (parentElement) {
    const style = window.getComputedStyle(parentElement);
    const bgColor = style.getPropertyValue('background-color');

    if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
      return bgColor; // Return the valid background color
    }

    parentElement = parentElement.parentElement; // Traverse to the next parent element
  }

  return null; // Return null if no valid background color was found
}
