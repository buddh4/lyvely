import { defineStore } from 'pinia';
import { I18nModelValidator, useI18nStore } from '@/i18n';
import { loadingStatus, useStatus } from '@/core';
import { UserRegistration, useUserRegistrationClient } from '@lyvely/interface';
import { reactive, ref } from 'vue';
import { useVerifyRegistrationEmailStore } from './verify-email.store';

export const useUserRegistrationStore = defineStore('user-registration', () => {
  const status = useStatus();
  const userRegistrationClient = useUserRegistrationClient();
  const verifyEmailStore = useVerifyRegistrationEmailStore();
  const model = ref(new UserRegistration());
  const validator = reactive(new I18nModelValidator<UserRegistration>(model.value));

  async function register() {
    model.value.locale = useI18nStore().locale;
    model.value.timezone = useI18nStore().timezone;

    if (!(await this.validator.validate())) return false;

    return loadingStatus(
      userRegistrationClient.register(model.value),
      status,
      validator as I18nModelValidator<UserRegistration>,
    )
      .then((otp) => verifyEmailStore.startVerificationOf(model.value.email, otp))
      .then(() => true)
      .catch(() => false);
  }

  async function validateUsername() {
    const isValid = await validator.validateField('username');
    if (!isValid) return;
    await userRegistrationClient.checkUsername({ value: model.value.username });
    validator.deleteError('username');
  }

  async function validateEmail() {
    const isValid = await validator.validateField('email');
    if (!isValid) return;
    await userRegistrationClient.checkUserEmail({ value: model.value.email });
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
