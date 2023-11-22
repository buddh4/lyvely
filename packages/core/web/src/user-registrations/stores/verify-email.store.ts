import { defineStore } from 'pinia';
import { useUserRegistrationService } from '../services';
import { VerifyEmailDto, ResendOtp } from '@lyvely/interface';
import { useAuthStore } from '@/auth/store/auth.store';
import { useEmailVerificationStore } from '@/user-accounts';

export const useVerifyRegistrationEmailStore = defineStore('verify-user-registration-email', () => {
  const userRegistrationService = useUserRegistrationService();
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
      const loginModel = await userRegistrationService.verifyEmail(dto);
      if (!loginModel) return false;
      await authStore.handleLogin(loginModel);
      return true;
    },
    resend: async (dto: ResendOtp) => {
      return userRegistrationService.resendVerifyEmail(dto);
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
