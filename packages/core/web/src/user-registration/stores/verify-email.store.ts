import { defineStore } from 'pinia';
import { VerifyEmailDto, ResendOtp, useUserRegistrationClient } from '@lyvely/interface';
import { useAuthStore } from '@/auth/store/auth.store';
import { useEmailVerificationStore } from '@/user-account';

export const useVerifyRegistrationEmailStore = defineStore('verify-user-registration-email', () => {
  const userRegistrationClient = useUserRegistrationClient();
  const authStore = useAuthStore();

  const {
    model,
    validator,
    errorMsg,
    otpInfo,
    verifyEmail,
    resendOtp,
    reset,
    startVerificationOf,
  } = useEmailVerificationStore({
    verify: async (dto: VerifyEmailDto) => {
      const loginModel = await userRegistrationClient.verifyEmail(dto);
      if (!loginModel) return false;
      await authStore.handleLogin(loginModel);
      return true;
    },
    resend: async (dto: ResendOtp) => {
      return userRegistrationClient.resendVerifyEmail(dto);
    },
  });

  return {
    verifyEmail,
    model,
    otpInfo,
    validator,
    errorMsg,
    startVerificationOf,
    reset,
    resendOtp,
  };
});
