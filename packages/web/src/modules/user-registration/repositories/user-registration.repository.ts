import repository from "@/repository";
import {
  UserRegistrationDto,
  ENDPOINT_USER_REGISTRATION,
  IUserRegistrationService,
  EndpointResult,
  VerifyEmailDto,
  ResendOtpDto,
} from "@lyvely/common";

const endpoint = ENDPOINT_USER_REGISTRATION;

export default {
  register(data: UserRegistrationDto) {
    return repository.post<
      EndpointResult<IUserRegistrationService["register"]>
    >(`${endpoint}/`, data);
  },

  verifyEmail(data: VerifyEmailDto) {
    return repository.post<
      EndpointResult<IUserRegistrationService["verifyEmail"]>
    >(`${endpoint}/verify-email`, data);
  },

  resendVerifyEmail(data: ResendOtpDto) {
    return repository.post<
      EndpointResult<IUserRegistrationService["resendVerifyEmail"]>
    >(`${endpoint}/resend-verify-email`, data);
  },
};
