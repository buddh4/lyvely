import {
  API_USER_REGISTRATION,
  IUserRegistrationClient,
  UserRegistrationEndpoints,
} from './user-registration.endpoint';
import { UserRegistration } from '../models';
import { useApi } from '@/repository';
import { VerifyEmailDto } from '@/user-account';
import { ResendOtp } from '@/otp';
import { StringFieldValidityRequest } from '@/validation';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'axios';

const api = useApi<IUserRegistrationClient>(API_USER_REGISTRATION);

export default {
  register(data: UserRegistration) {
    return api.post<'register'>(data);
  },

  verifyEmail(data: VerifyEmailDto) {
    return api.post<'verifyEmail'>(UserRegistrationEndpoints.VERIFY_EMAIL, data);
  },

  resendVerifyEmail(data: ResendOtp) {
    return api.post<'resendVerifyEmail'>(UserRegistrationEndpoints.RESENT_VERIFY_EMAIL, data);
  },

  checkUserEmail(data: StringFieldValidityRequest) {
    return api.post<'checkUserEmail'>(UserRegistrationEndpoints.CHECK_USER_EMAIL, data);
  },

  checkUsername(data: StringFieldValidityRequest) {
    return api.post<'checkUsername'>(UserRegistrationEndpoints.CHECK_USERNAME, data);
  },
};
