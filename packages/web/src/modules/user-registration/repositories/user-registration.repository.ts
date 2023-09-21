import repository from '@/repository';
import {
  UserRegistration,
  ENDPOINT_USER_REGISTRATION,
  IUserRegistrationService,
  EndpointResult,
  VerifyEmailDto,
  ResendOtp,
} from '@lyvely/common';

const endpoint = ENDPOINT_USER_REGISTRATION;

export default {
  register(data: UserRegistration) {
    return repository.post<EndpointResult<IUserRegistrationService['register']>>(
      `${endpoint}/`,
      data,
    );
  },

  verifyEmail(data: VerifyEmailDto) {
    return repository.post<EndpointResult<IUserRegistrationService['verifyEmail']>>(
      `${endpoint}/verify-email`,
      data,
    );
  },

  resendVerifyEmail(data: ResendOtp) {
    return repository.post<EndpointResult<IUserRegistrationService['resendVerifyEmail']>>(
      `${endpoint}/resend-verify-email`,
      data,
    );
  },
};
