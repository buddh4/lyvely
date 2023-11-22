import {
  ENDPOINT_RESET_PASSWORD,
  ENDPOINT_RESET_PASSWORD_SEND_MAIL,
  IResetPasswordService,
  SendResetPasswordMail,
  ResetPassword,
  useApiRepository,
} from '@lyvely/core-interface';
import { EndpointResult } from '@lyvely/common';

const resource = ENDPOINT_RESET_PASSWORD;
const SEND_MAIL_ENDPOINT = `${resource}/${ENDPOINT_RESET_PASSWORD_SEND_MAIL}`;

export default {
  async sendMail(data: SendResetPasswordMail) {
    return useApiRepository().post<EndpointResult<IResetPasswordService['sendMail']>>(
      SEND_MAIL_ENDPOINT,
      data,
      {
        withCaptcha: true,
      },
    );
  },
  async resetPassword(data: ResetPassword) {
    return useApiRepository().post<EndpointResult<IResetPasswordService['resetPassword']>>(
      `${resource}`,
      data,
    );
  },
};
