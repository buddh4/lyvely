import repository from '@/repository';
import {
  AddEmailDto,
  VerifyEmailDto,
  EndpointResult,
  IAccountService,
  ENDPOINT_ACCOUNT,
  ResendOtpDto,
} from '@lyvely/common';

const resource = ENDPOINT_ACCOUNT;

export default {
  async addEmail(model: AddEmailDto) {
    return repository.post<EndpointResult<IAccountService['addEmail']>>(`${resource}/add-email`, model);
  },

  async verifyEmail(model: VerifyEmailDto) {
    return repository.post<EndpointResult<IAccountService['verifyEmail']>>(`${resource}/verify-email`, model);
  },

  async resendOtp(model: ResendOtpDto) {
    return repository.post<EndpointResult<IAccountService['resendOtp']>>(`${resource}/resend-otp`, model);
  },
};
