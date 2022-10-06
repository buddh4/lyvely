import { defineStore } from "pinia";
import { ref } from "vue";

export const useVerifyEmailStore = defineStore("verify-email", () => {
  const email = ref("");
  const awaiting = ref(false);

  const setAwaiting = (awaitingMail: string) => {
    email.value = awaitingMail;
    awaiting.value = true;
  };

  const isAwaiting = () => {
    return awaiting.value;
  };

  return {
    email,
    awaiting,
    setAwaiting,
    isAwaiting,
  };
});
