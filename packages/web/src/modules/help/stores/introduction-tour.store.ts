import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useIntroductionTourStore = defineStore('help-introduction-tour', () => {
  const active = ref(false);

  function startTour() {
    active.value = true;
  }

  return {
    active,
    startTour,
  };
});
