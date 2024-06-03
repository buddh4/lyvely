import { computed, ref } from 'vue';

const isScrollingState = ref(false);
const isMouseOrTouch = ref(false);

const set = () => {
  if (!isMouseOrTouch.value) return;
  isScrollingState.value = true;
};

const setMouseOrTouch = () => (isMouseOrTouch.value = true);
const unSet = () => {
  setTimeout(() => {
    isScrollingState.value = false;
    isMouseOrTouch.value = false;
  });
};

window.addEventListener('touchstart', setMouseOrTouch, true);
window.addEventListener('mousedown', setMouseOrTouch, true);

window.addEventListener('scroll', set, true);

window.addEventListener('touchend', unSet, true);
window.addEventListener('scrollend', unSet, true);
window.addEventListener('mouseup', unSet, true);

/**
 * Returns a computed `isScrolling` value representing a global scroll state.
 */
export const useGlobalScroll = () => {
  return {
    isScrolling: computed(() => isScrollingState.value),
  };
};
