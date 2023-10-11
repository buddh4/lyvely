import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from '@/auth/store/auth.store';
import { ResendOtp, OtpInfo, VerifyEmailDto } from '@lyvely/core-interface';
import { IFieldValidationResult } from '@lyvely/common';
import { useAccountService } from '@/account/services/account.service';
import { useEmailVerificationStore } from '@/account';

export const useVerifyEmailStore = defineStore('verify-email', () => {
  const { user } = storeToRefs(useAuthStore());
  const accountService = useAccountService();
  const showModal = ref(false);

  const {
    model,
    validator,
    errorMsg,
    verifyEmail,
    resendOtp,
    otpInfo,
    startVerificationOf: startEmailVerificationOf,
    reset: resetEmailVerification,
  } = useEmailVerificationStore({
    verify: async (dto: VerifyEmailDto) => {
      await accountService.verifyEmail(dto);
      user.value!.findEmail(dto.email).verified = true;
      showModal.value = false;
      return true;
    },
    resend: async (dto: ResendOtp) => {
      return await accountService.resendOtp(dto);
    },
    validatorOptions: {
      rules: {
        email: [
          (value: string, result: IFieldValidationResult) => {
            if (!user.value?.findEmail(value)) {
              result.errors!.push('not_exist');
            }
          },
        ],
      },
    },
  });

  async function startVerificationOf(email: string, otpInfo?: OtpInfo) {
    showModal.value = true;
    return startEmailVerificationOf(email, otpInfo);
  }

  function reset() {
    showModal.value = false;
    resetEmailVerification();
  }

  return {
    model,
    otpInfo,
    reset,
    validator,
    showModal,
    startVerificationOf,
    errorMsg,
    verifyEmail,
    resendOtp,
  };
});