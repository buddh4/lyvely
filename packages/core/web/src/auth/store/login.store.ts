import { defineStore } from 'pinia';
import { I18nModelValidator } from '@/i18n';
import { loadingStatus, useStatus } from '@/core';
import { ref } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import { AuthService } from '@/auth/services/auth.service';
import { useAuthStore } from '@/auth/store/auth.store';
import { ModelValidator, UnauthenticatedServiceException } from '@lyvely/common';
import { UserStatus, LoginModel } from '@lyvely/core-interface';
import { useVerifyRegistrationEmailStore } from '@/user-registrations/stores';

export const useLoginStore = defineStore('user-login', () => {
  const status = useStatus();
  const authStore = useAuthStore();
  const authService = new AuthService();
  const loginModel = ref(new LoginModel());
  const stage = ref<'usernameOrEmail' | 'password'>('usernameOrEmail');
  const validator = ref(
    new I18nModelValidator(loginModel.value, { labelKey: 'auth.login.fields' }),
  );

  async function login(): Promise<RouteLocationRaw | false> {
    return loadingStatus(
      () => authService.login(loginModel.value),
      status,
      validator.value as ModelValidator,
    )
      .then(authStore.handleLogin)
      .then(() => ({ path: '/' }))
      .catch(handleLoginError);
  }

  function reset() {
    loginModel.value = new LoginModel();
    stage.value = 'usernameOrEmail';
    validator.value.setModel(loginModel.value);
    status.resetStatus();
  }

  const handleLoginError = async (err: any) => {
    if (!(err instanceof UnauthenticatedServiceException)) {
      return false;
    }

    if (err.data?.userStatus !== UserStatus.EmailVerification) {
      status.setError('auth.login.errors.invalid_input');
      return false;
    }

    // This may happen if the user intercepts the registration process
    useVerifyRegistrationEmailStore().startVerificationOf(loginModel.value.usernameOrEmail);

    return { name: 'VerifyEmail' };
  };

  return {
    status,
    login,
    reset,
    stage,
    loginModel,
    validator,
  };
});
