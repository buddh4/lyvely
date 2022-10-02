import { defineStore } from "pinia";
import { loadingStatus, useStatus } from "@/store/status";
import { UserRegistrationDto, ModelValidator } from "@lyvely/common";
import { ref } from "vue";
import { UserRegistrationService } from "@/modules/user-registration/services/user-registration.service";

export const useUserRegistrationStore = defineStore("user-registration", () => {
  const status = useStatus();
  const model = ref(new UserRegistrationDto());
  const validator = ref(new ModelValidator(model.value));
  const userRegistrationService = new UserRegistrationService();

  async function register() {
    if (!(await this.validator.validate())) return;

    return loadingStatus(userRegistrationService.register(model.value), status);
  }

  function reset() {
    status.resetStatus();
    model.value = new UserRegistrationDto();
    validator.value.setModel(model.value);
  }

  return {
    ...status,
    model,
    validator,
    register,
    reset,
  };
});
