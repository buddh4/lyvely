import repository from '@/repository';
import {
  Headers,
  ENDPOINT_RESET_PASSWORD,
  ENDPOINT_RESET_PASSWORD_SEND_MAIL,
  EndpointResult,
  IResetPasswordService,
  SendResetPasswordMailModel,
} from '@lyvely/common';

const resource = ENDPOINT_RESET_PASSWORD;
const SEND_MAIL_ENDPOINT = `${resource}/${ENDPOINT_RESET_PASSWORD_SEND_MAIL}`;

export default {
  async sendMail(data: SendResetPasswordMailModel) {
    return repository.post<EndpointResult<IResetPasswordService['sendMail']>>(SEND_MAIL_ENDPOINT, data, {
      withCaptcha: true,
    });
  },
};
