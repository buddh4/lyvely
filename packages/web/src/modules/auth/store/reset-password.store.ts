import { defineStore } from 'pinia';
import { ref } from 'vue';
import { loadingStatus, useStatus } from '@/store';
import { ResetPasswordService } from '@/modules/auth/services/reset-password.service';
import { ModelValidator, SendResetPasswordMailModel } from '@lyvely/common';
import { I18nModelValidator } from '@/modules/core/models/i18n-model.validator';

type ResetPasswordStage = 'init' | 'sent';

export const useSendResetPasswordMailStore = defineStore('send-reset-password-mail', () => {
  const status = useStatus();
  const stage = ref<ResetPasswordStage>('init');
  const resetPasswordService = new ResetPasswordService();

  const model = ref(new SendResetPasswordMailModel());
  const validator = ref(new I18nModelValidator(model.value));

  function setEmail(email: string) {
    model.value.email = email;
  }

  function reset() {
    status.resetStatus();
    stage.value = 'init';
    model.value = new SendResetPasswordMailModel();
    validator.value.setModel(model.value);
  }

  async function sendResetPasswordMail() {
    if (!(await validator.value.validate())) {
      return;
    }

    loadingStatus(resetPasswordService.sendMail(model.value), status, validator.value as ModelValidator).then(() =>
      setStage('sent'),
    );
  }

  function setStage(s: ResetPasswordStage) {
    stage.value = s;
  }

  return {
    status,
    model,
    validator,
    stage,
    reset,
    setEmail,
    sendResetPasswordMail,
  };
});
