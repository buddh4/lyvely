type VIEW_SIZE = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

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
