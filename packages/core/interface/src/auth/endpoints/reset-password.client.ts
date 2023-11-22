import { SendResetPasswordMail, ResetPassword } from '../models';
import { IResetPasswordService } from '../endpoints';
import resetPasswordRepository from './reset-password.repository';
import { unwrapResponse } from '@/endpoints';
import { useSingleton } from '@lyvely/common';

export class ResetPasswordClient implements IResetPasswordService {
  async sendMail(model: SendResetPasswordMail) {
    return unwrapResponse(resetPasswordRepository.sendMail(model));
  }

  async resetPassword(model: ResetPassword) {
    return unwrapResponse(resetPasswordRepository.resetPassword(model));
  }
}

export const useResetPasswordClient = useSingleton(() => new ResetPasswordClient());
