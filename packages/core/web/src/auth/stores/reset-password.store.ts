import { defineStore } from 'pinia';
import { ref } from 'vue';
import { I18nModelValidator } from '@/i18n';
import { loadingStatus, useStatus } from '@/core';
import { ResetPassword, useResetPasswordClient } from '@lyvely/interface';
import { PATH_LOGIN } from '../auth.constants';

type ResetPasswordStage = 'init' | 'sent' | 'reset';

export const useResetPasswordStore = defineStore('reset-password', () => {
  const status = useStatus();
  const stage = ref<ResetPasswordStage>('init');
  const resetPasswordClient = useResetPasswordClient();

  const model = ref(new ResetPassword());
  const validator = ref(
    new I18nModelValidator<ResetPassword>(model.value, {
      labelKey: 'auth.reset_password.fields',
    })
  );

  function reset() {
    setStage('init');
    status.resetStatus();
    model.value = new ResetPassword();
    validator.value.setModel(model.value);
  }

  async function resetPassword() {
    if (!(await validator.value.validate())) return;

    return loadingStatus(
      resetPasswordClient.resetPassword(model.value),
      status,
      validator.value as I18nModelValidator<ResetPassword>
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
