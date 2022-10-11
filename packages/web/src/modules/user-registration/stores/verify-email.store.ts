import { defineStore } from "pinia";
import { ref } from "vue";

export const useVerifyEmailStore = defineStore("verify-email", () => {
  const email = ref("");

  const setAwaiting = (awaitingMail: string) => {
    email.value = awaitingMail;
  };

  const setEmail = (awaitingEmail: string) => {
    email.value = awaitingEmail;
  };

  const reset = () => {
    email.value = "";
  };

  return {
    email,
    setEmail,
    reset,
  };
});
