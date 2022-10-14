import { defineStore } from "pinia";
import { ref } from "vue";
import { UserRegistrationService } from "@/modules/user-registration/services/user-registration.service";
import { VerifyEmailDto } from "@lyvely/common";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export const useVerifyEmailStore = defineStore("verify-email", () => {
  const model = ref(new VerifyEmailDto());
  const userRegistrationService = new UserRegistrationService();
  const authStore = useAuthStore();

  const setEmail = (email: string) => {
    model.value.email = email;
  };

  const reset = () => {
    model.value = new VerifyEmailDto();
  };

  async function verifyEmail() {
    const loginModel = await userRegistrationService.verifyEmail(model.value);
    if (loginModel) {
      await authStore.handleLogin(loginModel);
      return true;
    }

    return false;
  }

  return {
    verifyEmail,
    model,
    setEmail,
    reset,
  };
});
