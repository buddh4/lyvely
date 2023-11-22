import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserAccountStore = defineStore('account-store', () => {
  const showAccountDrawer = ref(false);

  return {
    showAccountDrawer,
  };
});
