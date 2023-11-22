import {
  ENDPOINT_USER_REGISTRATION,
  IUserRegistrationClient,
  UserRegistrationEndpointPaths,
} from './user-registration.endpoint';
import { UserRegistration } from '../models';
import { useApi } from '@/repository';
import { VerifyEmailDto } from '@/user-account';
import { ResendOtp } from '@/otp';
import { StringFieldValidityRequest } from '@/validation';

const api = useApi<IUserRegistrationClient>(ENDPOINT_USER_REGISTRATION);

export default {
  register(data: UserRegistration) {
    return api.post<'register'>(data);
  },

  verifyEmail(data: VerifyEmailDto) {
    return api.post<'verifyEmail'>(UserRegistrationEndpointPaths.VERIFY_EMAIL, data);
  },

  resendVerifyEmail(data: ResendOtp) {
    return api.post<'resendVerifyEmail'>(UserRegistrationEndpointPaths.RESENT_VERIFY_EMAIL, data);
  },

  checkUserEmail(data: StringFieldValidityRequest) {
    return api.post<'checkUserEmail'>(UserRegistrationEndpointPaths.CHECK_USER_EMAIL, data);
  },

  checkUsername(data: StringFieldValidityRequest) {
    return api.post<'checkUsername'>(UserRegistrationEndpointPaths.CHECK_USERNAME, data);
  },
};
