import { defineStore } from "pinia";
import { loadingStatus, useStatus } from "@/store/status";
import { ref } from "vue";
import { AuthService } from "@/modules/users/services/auth.service";
import { useAuthStore } from "@/modules/users/store/auth.store";
import { LoginModel, ModelValidator } from "@lyvely/common";

export const useLoginStore = defineStore("user-login", () => {
  const status = useStatus();
  const authStore = useAuthStore();
  const authService = new AuthService();
  const loginModel = ref(new LoginModel());
  const validator = ref(new ModelValidator(loginModel.value));

  async function login() {
    if (!(await validator.value.validate())) {
      return false;
    }

    return await loadingStatus(
      authService.login(loginModel.value.email, loginModel.value.password),
      status
    )
      .then(authStore.handleLogin)
      .catch(handleLoginError);
  }

  async function handleLoginError(err: any) {
    status.setError("users.login.errors.invalid_input");
  }

  return {
    status,
    login,
    loginModel,
    validator,
  };
});