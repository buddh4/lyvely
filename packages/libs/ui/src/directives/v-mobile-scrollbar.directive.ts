import { Directive } from 'vue';

export const vMobileScrollbar: Directive = {
  mounted: (el) => {
    const isInitialized = false;

    const hide = (timeout = 0) =>
      window.setTimeout(() => el.classList.add('scrollbar-hidden'), timeout);

    hide();
    // Async actions may trigger the scrollbar to be visible, this is a workaround for such situations (e.g. content stream)...
    hide(500);

    el.addEventListener('scroll', function () {
      if (!isInitialized) el.classList.remove('scrollbar-hidden');
    });
  },
};
