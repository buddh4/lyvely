import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useHelpStore = defineStore('help', () => {
  const showModal = ref(false);

  function setShowModal(doShow = true) {
    showModal.value = doShow;
  }

  return {
    showModal,
    setShowModal,
  };
});
