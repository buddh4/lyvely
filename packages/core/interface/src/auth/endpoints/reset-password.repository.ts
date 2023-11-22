import {
  ENDPOINT_RESET_PASSWORD,
  IResetPasswordService,
  ResetPasswordEndpointPaths,
} from './reset-password.endpoint';
import { SendResetPasswordMail, ResetPassword } from '../models';
import { useApi } from '@/repository';

const api = useApi<IResetPasswordService>(ENDPOINT_RESET_PASSWORD);

export default {
  async sendMail(data: SendResetPasswordMail) {
    return api.post<'sendMail'>(ResetPasswordEndpointPaths.SEND_MAIL, data, {
      withCaptcha: true,
    });
  },
  async resetPassword(data: ResetPassword) {
    return api.post<'resetPassword'>(data);
  },
};
