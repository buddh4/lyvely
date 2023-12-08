import {
  API_RESET_PASSWORD,
  IResetPasswordService,
  ResetPasswordEndpoints,
} from './reset-password.endpoint';
import { SendResetPasswordMail, ResetPassword } from '../models';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';

const api = useApi<IResetPasswordService>(API_RESET_PASSWORD);

export default {
  async sendMail(data: SendResetPasswordMail, options?: IProfileApiRequestOptions) {
    return api.post<'sendMail'>(ResetPasswordEndpoints.SEND_MAIL, data, {
      ...options,
      withCaptcha: true,
    });
  },
  async resetPassword(data: ResetPassword, options?: IProfileApiRequestOptions) {
    return api.post<'resetPassword'>(data, {}, options);
  },
};
