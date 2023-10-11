import { defineStore } from 'pinia';
import { ref } from 'vue';
import { I18nModelValidator } from '@/i18n';
import { loadingStatus, useStatus } from '@/core';
import { ResetPasswordService } from '@/auth/services/reset-password.service';
import { ModelValidator } from '@lyvely/common';
import { ResetPassword } from '@lyvely/core-interface';
import { PATH_LOGIN } from '@/auth';

type ResetPasswordStage = 'init' | 'sent' | 'reset';

export const useResetPasswordStore = defineStore('reset-password', () => {
  const status = useStatus();
  const stage = ref<ResetPasswordStage>('init');
  const resetPasswordService = new ResetPasswordService();

  const model = ref(new ResetPassword());
  const validator = ref(
    new I18nModelValidator(model, { translationKey: 'auth.reset_password.fields' }),
  );

  function reset() {
    setStage('init');
    status.resetStatus();
    model.value = new ResetPassword();
    validator.value.setModel(model);
  }

  async function resetPassword() {
    if (!(await validator.value.validate())) return;

    return loadingStatus(
      resetPasswordService.resetPassword(model.value),
      status,
      validator.value as ModelValidator,
    ).then(() => ({ path: PATH_LOGIN }));

    // loadingStatus(resetPasswordService.sendMail);
  }

  function setStage(s: ResetPasswordStage) {
    stage.value = s;
  }

  function setToken(t: string) {
    model.value.token = t;
    if (t && t.length) {
      setStage('reset');
    }
  }

  return {
    status,
    model,
    validator,
    stage,
    resetPassword,
    setStage,
    setToken,
    reset,
  };
});
