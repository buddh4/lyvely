import { defineStore } from 'pinia';
import { ref } from 'vue';
import { I18nModelValidator } from '@/i18n';
import { loadingStatus, useStatus } from '@/core';
import { ResetPasswordService } from '@/auth/services/reset-password.service';
import { SendResetPasswordMail } from '@lyvely/interface';
import { useCaptchaStore } from '@/captcha/captcha.store';
import { useResetPasswordStore } from '@/auth/store/reset-password.store';

export const useSendResetPasswordMailStore = defineStore('send-reset-password-mail', () => {
  const status = useStatus();
  const resetPasswordService = new ResetPasswordService();
  const resetPasswordStore = useResetPasswordStore();
  const captchaStore = useCaptchaStore();

  const model = ref(new SendResetPasswordMail());

  const validator = ref(
    new I18nModelValidator<SendResetPasswordMail>(model.value, {
      labelKey: 'auth.reset_password.fields',
    }),
  );

  function setUsernameOrEmail(usernameOrEmail: string) {
    model.value.usernameOrEmail = usernameOrEmail;
  }

  function reset() {
    status.resetStatus();
    resetPasswordStore.reset();
    model.value = new SendResetPasswordMail();
    validator.value.setModel(model.value);
  }

  async function sendResetPasswordMail() {
    if (!(await validate())) return;
    return loadingStatus(
      () => resetPasswordService.sendMail(model.value),
      status,
      validator.value as I18nModelValidator<SendResetPasswordMail>,
    ).then(() => resetPasswordStore.setStage('sent'));
  }

  async function validate() {
    return (await validator.value.validate()) && (await captchaStore.validate());
  }

  return {
    status,
    model,
    validator,
    reset,
    setUsernameOrEmail,
    sendResetPasswordMail,
  };
});
