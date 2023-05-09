import { SELECTOR_FORM_FIELD } from '@/modules/ui/utils';

export function accessibilityFocus(elem?: string | HTMLElement | null) {
  if (!elem) {
    console.warn('Tried to focus non existing element');
    return;
  }

  const element: HTMLElement | null =
    elem instanceof HTMLElement ? elem : document.querySelector(elem);

  if (!element) {
    console.warn('Tried to focus non existing element');
    return;
  }

  const isFormElement = element?.matches(SELECTOR_FORM_FIELD);
  if (!isFormElement) element.classList.add('focus-hidden');

  element.focus();

  if (!isFormElement) {
    element.addEventListener(
      'blur',
      () => {
        element.classList.remove('focus-hidden');
      },
      { once: true },
    );
  }
}
