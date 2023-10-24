import { Endpoint } from '@lyvely/common';
import { ResetPassword, SendResetPasswordMail } from '../models';

export interface IResetPasswordService {
  sendMail(model: SendResetPasswordMail): void;
  resetPassword(model: ResetPassword): void;
}

export type ResetPasswordEndpoint = Endpoint<IResetPasswordService>;
export const ENDPOINT_RESET_PASSWORD = 'reset-password';
export const ENDPOINT_RESET_PASSWORD_SEND_MAIL = 'send-mail';
