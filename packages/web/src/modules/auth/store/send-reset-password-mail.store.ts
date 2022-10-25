import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { loadingStatus, useStatus } from '@/store';
import { ResetPasswordService } from '@/modules/auth/services/reset-password.service';
import { ModelValidator, SendResetPasswordMail } from '@lyvely/common';
import { I18nModelValidator } from '@/modules/core/models/i18n-model.validator';
import { useCaptchaStore } from '@/modules/captcha/stores/captcha.store';
import { useResetPasswordStore } from '@/modules/auth/store/reset-password.store';

export const useSendResetPasswordMailStore = defineStore('send-reset-password-mail', () => {
  const status = useStatus();
  const resetPasswordService = new ResetPasswordService();
  const resetPasswordStore = useResetPasswordStore();
  const captchaStore = useCaptchaStore();

  const model = ref(new SendResetPasswordMail());
  const validator = ref(new I18nModelValidator(model));

  function setEmail(email: string) {
    model.value.email = email;
  }

  function reset() {
    status.resetStatus();
    resetPasswordStore.reset();
    model.value = new SendResetPasswordMail();
    validator.value.setModel(model);
  }

  async function sendResetPasswordMail() {
    if (!(await validator.value.validate())) return;
    loadingStatus(resetPasswordService.sendMail(model.value), status, validator.value as ModelValidator).then(() =>
      resetPasswordStore.setStage('sent'),
    );
  }

  async function validate() {
    return (await validator.value.validate()) && (await captchaStore.validate());
  }

  return {
    status,
    model,
    validator,
    reset,
    setEmail,
    sendResetPasswordMail,
  };
});
