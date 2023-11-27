import { Endpoint } from '@/endpoints';
import { ResetPassword, SendResetPasswordMail } from '../models';

export interface IResetPasswordService {
  sendMail(model: SendResetPasswordMail): void;
  resetPassword(model: ResetPassword): void;
}

export type ResetPasswordEndpoint = Endpoint<IResetPasswordService>;
export const ENDPOINT_RESET_PASSWORD = 'reset-password';

export const ResetPasswordEndpointPaths = {
  SEND_MAIL: 'send-mail',
};
