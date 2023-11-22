import {
  UserRegistration,
  ENDPOINT_USER_REGISTRATION,
  IUserRegistrationService,
  VerifyEmailDto,
  ResendOtp,
  StringFieldValidityRequest,
  useApiRepository,
} from '@lyvely/interface';
import { EndpointResult } from '@lyvely/common';

const endpoint = ENDPOINT_USER_REGISTRATION;

export default {
  register(data: UserRegistration) {
    return useApiRepository().post<EndpointResult<IUserRegistrationService['register']>>(
      `${endpoint}/`,
      data,
    );
  },

  verifyEmail(data: VerifyEmailDto) {
    return useApiRepository().post<EndpointResult<IUserRegistrationService['verifyEmail']>>(
      `${endpoint}/verify-email`,
      data,
    );
  },

  resendVerifyEmail(data: ResendOtp) {
    return useApiRepository().post<EndpointResult<IUserRegistrationService['resendVerifyEmail']>>(
      `${endpoint}/resend-verify-email`,
      data,
    );
  },

  checkUserEmailValidity(data: StringFieldValidityRequest) {
    return useApiRepository().post<
      EndpointResult<IUserRegistrationService['checkUserEmailValidity']>
    >(`${endpoint}/check-user-email`, data);
  },

  checkUserNameValidity(data: StringFieldValidityRequest) {
    return useApiRepository().post<
      EndpointResult<IUserRegistrationService['checkUserNameValidity']>
    >(`${endpoint}/check-user-name`, data);
  },
};
