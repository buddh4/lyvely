export const hasOverflow = (elem: HTMLElement) => {
  return elem.scrollHeight > elem.clientHeight || elem.scrollWidth > elem.clientWidth;
};
