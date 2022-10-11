import { defineStore } from "pinia";
import { loadingStatus, useStatus } from "@/store/status";
import {
  UserRegistrationDto,
  ModelValidator,
  ILoginResponse,
} from "@lyvely/common";
import { ref } from "vue";
import { UserRegistrationService } from "@/modules/user-registration/services/user-registration.service";
import { useVerifyEmailStore } from "@/modules/user-registration/stores/verify-email.store";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { PATH_VERIFY_EMAIL } from "@/modules/user-registration/routes";

export const useUserRegistrationStore = defineStore("user-registration", () => {
  const status = useStatus();
  const userRegistrationService = new UserRegistrationService();
  const verifyEmailStore = useVerifyEmailStore();
  const authStore = useAuthStore();
  const model = ref(new UserRegistrationDto());
  const validator = ref(new ModelValidator(model.value));

  async function register() {
    if (!(await this.validator.validate())) return;

    return loadingStatus(
      userRegistrationService.register(model.value),
      status,
      validator.value as ModelValidator
    )
      .then((loginModel: ILoginResponse) => {
        authStore.handleLogin(loginModel);
        verifyEmailStore.setEmail(model.value.email);
        this.$router.push(PATH_VERIFY_EMAIL);
      })
      .catch((err) => {
        // TODO: handle email error etc..
      });
  }

  function reset() {
    status.resetStatus();
    model.value = new UserRegistrationDto();
    validator.value.setModel(model.value);
  }

  return {
    status,
    model,
    validator,
    register,
    reset,
  };
});
