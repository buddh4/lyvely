import { Endpoint } from '@/endpoints';
import { SendResetPasswordMailModel } from '@/auth/models/send-reset-password-mail.model';

export interface IResetPasswordService {
  sendMail(model: SendResetPasswordMailModel);
}

export type ResetPasswordEndpoint = Endpoint<IResetPasswordService>;
export const ENDPOINT_RESET_PASSWORD = 'reset-password';
export const ENDPOINT_RESET_PASSWORD_SEND_MAIL = 'send-mail';
