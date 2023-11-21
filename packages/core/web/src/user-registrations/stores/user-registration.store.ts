import { defineStore } from 'pinia';
import { I18nModelValidator, useI18nStore } from '@/i18n';
import { loadingStatus, useStatus } from '@/core';
import { UserRegistration } from '@lyvely/core-interface';
import { reactive, ref } from 'vue';
import { useUserRegistrationService } from '../services';
import { useVerifyRegistrationEmailStore } from './verify-email.store';

export const useUserRegistrationStore = defineStore('user-registrations', () => {
  const status = useStatus();
  const userRegistrationService = useUserRegistrationService();
  const verifyEmailStore = useVerifyRegistrationEmailStore();
  const model = ref(new UserRegistration());
  const validator = reactive(new I18nModelValidator<UserRegistration>(model.value));

  async function register() {
    if (!(await this.validator.validate())) return false;

    model.value.locale = useI18nStore().locale;

    return loadingStatus(
      userRegistrationService.register(model.value),
      status,
      validator as I18nModelValidator<UserRegistration>,
    ).then(async (otp) => {
      await verifyEmailStore.startVerificationOf(model.value.email, otp);
      return true;
    });
  }

  async function validateUsername() {
    const isValid = await validator.validateField('username');
    if (!isValid) return;
    await userRegistrationService.checkUserNameValidity({ value: model.value.username });
    validator.deleteError('username');
  }

  async function validateEmail() {
    const isValid = await validator.validateField('email');
    if (!isValid) return;
    await userRegistrationService.checkUserEmailValidity({ value: model.value.email });
    validator.deleteError('email');
  }

  function reset() {
    status.resetStatus();
    model.value = new UserRegistration();
    validator.setModel(model.value);
  }

  return {
    status,
    model,
    validator,
    register,
    reset,
    validateUsername,
    validateEmail,
  };
});
