import { defineStore } from 'pinia';

import { ref, computed, Ref } from 'vue';

export const useCreateProfileStore = defineStore('create-profile', () => {
  const show = ref(false);

  return {
    show
  }
})

