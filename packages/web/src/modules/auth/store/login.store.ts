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
  const stage = ref<"email" | "password">("email");
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

  function reset() {
    loginModel.value = new LoginModel();
    stage.value = "email";
    validator.value.setModel(loginModel.value);
    status.resetStatus();
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
    reset,
    stage,
    loginModel,
    validator,
  };
});
