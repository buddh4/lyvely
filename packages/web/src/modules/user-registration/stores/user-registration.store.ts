import { defineStore } from 'pinia';
import { loadingStatus, useStatus } from '@/store';
import { UserRegistrationDto, ModelValidator } from '@lyvely/common';
import { ref } from 'vue';
import { UserRegistrationService } from '../services/user-registration.service';
import { useVerifyRegistrationEmailStore } from './verify-email.store';
import { I18nModelValidator } from '@/modules/core/models/i18n-model.validator';

export const useUserRegistrationStore = defineStore('user-registration', () => {
  const status = useStatus();
  const userRegistrationService = new UserRegistrationService();
  const verifyEmailStore = useVerifyRegistrationEmailStore();
  const model = ref(new UserRegistrationDto());
  const validator = ref(new I18nModelValidator<UserRegistrationDto>(model.value));

  async function register() {
    if (!(await this.validator.validate())) return false;

    return loadingStatus(userRegistrationService.register(model.value), status, validator.value as ModelValidator).then(
      async (otp) => {
        await verifyEmailStore.startVerificationOf(model.value.email, otp);
        return true;
      },
    );
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
