import { defineStore } from "pinia";
import { ref } from "vue";
import { UserRegistrationService } from "@/modules/user-registration/services/user-registration.service";
import {
  VerifyEmailDto,
  UnauthenticatedServiceException,
  ResendOtpDto,
  ForbiddenServiceException,
} from "@lyvely/common";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export const useVerifyEmailStore = defineStore("verify-email", () => {
  const model = ref(new VerifyEmailDto());
  const attempts = ref<number | undefined>();
  const errorMsg = ref<undefined | string>();
  const userRegistrationService = new UserRegistrationService();
  const authStore = useAuthStore();

  const setEmail = (email: string) => {
    model.value.email = email;
  };

  const reset = () => {
    softReset();
    model.value = new VerifyEmailDto();
  };

  const softReset = () => {
    model.value.otp = "";
    attempts.value = undefined;
    errorMsg.value = undefined;
  };

  async function resend() {
    try {
      softReset();
      await userRegistrationService.resendVerifyEmail(
        new ResendOtpDto({ email: model.value.email })
      );
    } catch (e: any) {
      errorMsg.value = e?.message || "error.unknown";
    }
  }

  async function verifyEmail() {
    try {
      if (attempts.value === 0) return false;
      errorMsg.value = undefined;

      const loginModel = await userRegistrationService.verifyEmail(model.value);
      if (loginModel) {
        await authStore.handleLogin(loginModel);
        return true;
      }

      return false;
    } catch (e) {
      handleError(e);
    }
  }

  function handleError(e: any) {
    if (e instanceof UnauthenticatedServiceException) {
      attempts.value = e.data?.attempts;
      if (attempts.value === 0) {
        errorMsg.value = "auth.otp.errors.maxAttempts";
      } else {
        errorMsg.value = "auth.otp.errors.attempts";
      }
    } else if (e instanceof ForbiddenServiceException) {
      errorMsg.value = "auth.otp.errors.attempts";
    } else {
      errorMsg.value = e?.message || "error.unknown";
    }
  }

  return {
    verifyEmail,
    model,
    attempts,
    errorMsg,
    setEmail,
    reset,
    resend,
  };
});
