import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from '@/auth/store/auth.store';
import { ResendOtp, OtpInfo, VerifyEmailDto, useUserAccountClient } from '@lyvely/interface';
import { useEmailVerificationStore } from '@/user-account';

export const useVerifyEmailStore = defineStore('verify-email', () => {
  const { user } = storeToRefs(useAuthStore());
  const userAccountClient = useUserAccountClient();
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
      await userAccountClient.verifyEmail(dto);
      user.value!.findEmail(dto.emailOrUsername)!.verified = true;
      showModal.value = false;
      return true;
    },
    resend: async (dto: ResendOtp) => {
      return await userAccountClient.resendOtp(dto);
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
