import repository from '@/repository';
import {
  ENDPOINT_RESET_PASSWORD,
  ENDPOINT_RESET_PASSWORD_SEND_MAIL,
  EndpointResult,
  IResetPasswordService,
  SendResetPasswordMail,
  ResetPassword,
} from '@lyvely/common';

const resource = ENDPOINT_RESET_PASSWORD;
const SEND_MAIL_ENDPOINT = `${resource}/${ENDPOINT_RESET_PASSWORD_SEND_MAIL}`;

export default {
  async sendMail(data: SendResetPasswordMail) {
    return repository.post<EndpointResult<IResetPasswordService['sendMail']>>(SEND_MAIL_ENDPOINT, data, {
      withCaptcha: true,
    });
  },
  async resetPassword(data: ResetPassword) {
    return repository.post<EndpointResult<IResetPasswordService['resetPassword']>>(`${resource}`, data);
  },
};
