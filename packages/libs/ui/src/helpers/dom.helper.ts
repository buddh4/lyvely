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

export function findParent(element: HTMLElement | null | undefined, selector: string): HTMLElement | null {
  if(!element) return null;
  if (element.matches(selector)) {
    return element;
  }
  return element.parentNode && findParent(element.parentElement, selector);
}
