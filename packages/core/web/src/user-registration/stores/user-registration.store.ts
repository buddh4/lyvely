import { defineStore } from 'pinia';
import { I18nModelValidator } from '@/i18n';
import { loadingStatus, useStatus } from '@/core';
import { UserRegistration } from '@lyvely/core-interface';
import { ModelValidator } from '@lyvely/common';
import { ref } from 'vue';
import { UserRegistrationService } from '../services/user-registration.service';
import { useVerifyRegistrationEmailStore } from './verify-email.store';

export const useUserRegistrationStore = defineStore('user-registration', () => {
  const status = useStatus();
  const userRegistrationService = new UserRegistrationService();
  const verifyEmailStore = useVerifyRegistrationEmailStore();
  const model = ref(new UserRegistration());
  const validator = ref(new I18nModelValidator<UserRegistration>(model.value));

  async function register() {
    if (!(await this.validator.validate())) return false;

    return loadingStatus(
      userRegistrationService.register(model.value),
      status,
      validator.value as ModelValidator,
    ).then(async (otp) => {
      await verifyEmailStore.startVerificationOf(model.value.email, otp);
      return true;
    });
  }

  function reset() {
    status.resetStatus();
    model.value = new UserRegistration();
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
