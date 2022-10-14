import { defineStore } from "pinia";
import { loadingStatus, useStatus } from "@/store";
import { UserRegistrationDto, ModelValidator } from "@lyvely/common";
import { ref } from "vue";
import { UserRegistrationService } from "../services/user-registration.service";
import { useVerifyEmailStore } from "./verify-email.store";

export const useUserRegistrationStore = defineStore("user-registration", () => {
  const status = useStatus();
  const userRegistrationService = new UserRegistrationService();
  const verifyEmailStore = useVerifyEmailStore();
  const model = ref(new UserRegistrationDto());
  const validator = ref(new ModelValidator<UserRegistrationDto>(model.value));

  async function register() {
    if (!(await this.validator.validate())) return false;

    return loadingStatus(
      userRegistrationService.register(model.value),
      status,
      validator.value as ModelValidator
    ).then(() => {
      verifyEmailStore.setEmail(model.value.email);
      return true;
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
