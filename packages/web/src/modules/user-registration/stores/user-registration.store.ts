import { defineStore } from "pinia";
import { loadingStatus, useStatus } from "@/store";
import {
  UserRegistrationDto,
  ModelValidator,
  ILoginResponse,
} from "@lyvely/common";
import { ref } from "vue";
import { UserRegistrationService } from "../services/user-registration.service";
import { useVerifyEmailStore } from "./verify-email.store";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { PATH_VERIFY_EMAIL } from "../routes/paths";

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
    ).then((loginModel: ILoginResponse) => {
      authStore.handleLogin(loginModel);
      verifyEmailStore.setEmail(model.value.email);
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
