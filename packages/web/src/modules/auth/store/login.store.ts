import { defineStore } from 'pinia';
import { loadingStatus, useStatus } from '@/store';
import { ref } from 'vue';
import { RouteLocationRaw } from 'vue-router';
import { AuthService } from '@/modules/auth/services/auth.service';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { I18nModelValidator } from '@/modules/core/models/i18n-model.validator';
import { UnauthenticatedServiceException, UserStatus, LoginModel } from '@lyvely/common';
import { useVerifyRegistrationEmailStore } from '@/modules/user-registration/stores/verify-email.store';

export const useLoginStore = defineStore('user-login', () => {
  const status = useStatus();
  const authStore = useAuthStore();
  const authService = new AuthService();
  const loginModel = ref(new LoginModel());
  const stage = ref<'email' | 'password'>('email');
  const validator = ref(
    new I18nModelValidator(loginModel.value, {
      translationKey: 'auth.login.fields',
    }),
  );

  async function login(): Promise<RouteLocationRaw | false> {
    if (!(await validator.value.validate())) return false;

    return loadingStatus(authService.login(loginModel.value), status)
      .then(authStore.handleLogin)
      .then(() => ({ path: '/' }))
      .catch(handleLoginError);
  }

  function reset() {
    loginModel.value = new LoginModel();
    stage.value = 'email';
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
    useVerifyRegistrationEmailStore().startVerificationOf(loginModel.value.email);

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
