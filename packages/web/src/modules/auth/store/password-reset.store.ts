import { defineStore, storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useStatus } from '@/store';
import { useLoginStore } from '@/modules/auth/store/login.store';

export const usePasswordResetStore = defineStore('password-reset', () => {
  const status = useStatus();
  const email = ref('');
  const captcha = ref('');

  function setEmail(e: string) {
    email.value = e;
  }

  return {
    email,
    captcha,
    setEmail,
  };
});
