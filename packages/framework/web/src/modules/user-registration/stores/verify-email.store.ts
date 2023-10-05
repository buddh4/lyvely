import { defineStore } from 'pinia';
import { UserRegistrationService } from '../services/user-registration.service';
import { VerifyEmailDto } from '@lyvely/user-accounts-interface-interface';
import { ResendOtp, OtpInfo } from '@lyvely/otp-interface';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useEmailVerificationStore } from '@/modules/account';

export const useVerifyRegistrationEmailStore = defineStore('verify-user-registration-email', () => {
  const userRegistrationService = new UserRegistrationService();
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
