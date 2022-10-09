import { defineStore } from "pinia";
import { loadingStatus, useStatus } from "@/store/status";
import { ref } from "vue";
import { AuthService } from "@/modules/auth/services/auth.service";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { LoginModel } from "@lyvely/common";
import { I18nModelValidator } from "@/modules/core/models/i18n-model.validator";

export const useLoginStore = defineStore("user-login", () => {
  const status = useStatus();
  const authStore = useAuthStore();
  const authService = new AuthService();
  const loginModel = ref(new LoginModel());
  const validator = ref(
    new I18nModelValidator(loginModel.value, {
      translationKey: "users.login.fields",
    })
  );

  async function login() {
    if (!(await validator.value.validate())) {
      return false;
    }

    return loadingStatus(authService.login(loginModel.value), status)
      .then(authStore.handleLogin)
      .then(() => true)
      .catch(handleLoginError);
  }

  async function handleLoginError(err: any) {
    if (err?.response?.status === 401) {
      status.setError("users.login.errors.invalid_input");
    }
    return false;
  }

  return {
    status,
    login,
    loginModel,
    validator,
  };
});
