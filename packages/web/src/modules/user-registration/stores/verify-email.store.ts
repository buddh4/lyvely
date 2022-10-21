import { defineStore } from "pinia";
import { ref } from "vue";
import { UserRegistrationService } from "@/modules/user-registration/services/user-registration.service";
import {
  VerifyEmailDto,
  UnauthenticatedServiceException,
  ResendOtpDto,
  OtpInfo,
} from "@lyvely/common";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { I18nModelValidator } from "@/modules/core/models/i18n-model.validator";

export const useVerifyRegistrationEmailStore = defineStore(
  "verify-user-registration-email",
  () => {
    const model = ref(new VerifyEmailDto());
    const validator = ref(new I18nModelValidator(model.value));
    const attempts = ref(0);
    const errorMsg = ref<undefined | string>();
    const userRegistrationService = new UserRegistrationService();
    const otpInfo = ref(new OtpInfo());
    const authStore = useAuthStore();

    const startVerificationOf = async (
      email: string,
      otpOrRemember?: OtpInfo | boolean
    ) => {
      model.value.email = email;
      if (otpOrRemember instanceof OtpInfo) {
        otpInfo.value = otpOrRemember;
      } else {
        await resend(otpOrRemember);
      }
    };

    const reset = () => {
      softReset();
      model.value = new VerifyEmailDto();
      validator.value.setModel(model.value);
    };

    const softReset = () => {
      model.value.otp = "";
      validator.value.reset();
      otpInfo.value = new OtpInfo();
      attempts.value = 0;
      errorMsg.value = undefined;
    };

    async function resend(remember?: boolean) {
      try {
        softReset();
        otpInfo.value = await userRegistrationService.resendVerifyEmail(
          new ResendOtpDto({ email: model.value.email, remember: remember })
        );
      } catch (e: any) {
        errorMsg.value = e?.message || "error.unknown";
      }
    }

    async function verifyEmail() {
      try {
        if (!(await validate())) return false;

        errorMsg.value = undefined;

        otpInfo.value.attempts++;
        const loginModel = await userRegistrationService.verifyEmail(
          model.value
        );

        if (!loginModel) {
          return false;
        }

        await authStore.handleLogin(loginModel);
        return true;
      } catch (e) {
        handleError(e);
      }
    }

    async function validate() {
      if (!(await validator.value.validate())) {
        errorMsg.value = validator.value.getError("otp");
        return false;
      }

      if (!otpInfo.value.hasAttemptsLeft()) {
        errorMsg.value = "otp.errors.maxAttempts";
        return false;
      }

      if (otpInfo.value.isExpired()) {
        errorMsg.value = "otp.errors.expired";
        return false;
      }

      return true;
    }

    function handleError(e: any) {
      if (e instanceof UnauthenticatedServiceException) {
        errorMsg.value = !otpInfo.value.hasAttemptsLeft()
          ? "otp.errors.maxAttempts"
          : otpInfo.value.isExpired()
          ? "otp.errors.expired"
          : "otp.errors.invalid";
      } else {
        errorMsg.value = e?.message || "error.unknown";
      }
    }

    return {
      verifyEmail,
      model,
      otpInfo,
      validator,
      attempts,
      errorMsg,
      startVerificationOf,
      reset,
      resend,
    };
  }
);
