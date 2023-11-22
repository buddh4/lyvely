import { IResetPasswordService, SendResetPasswordMail, ResetPassword } from '@lyvely/interface';
import resetPasswordRepository from '@/auth/repositories/reset-password.repository';
import { unwrapResponse } from '@/core';

export class ResetPasswordService implements IResetPasswordService {
  async sendMail(model: SendResetPasswordMail) {
    return unwrapResponse(resetPasswordRepository.sendMail(model));
  }

  async resetPassword(model: ResetPassword) {
    return unwrapResponse(resetPasswordRepository.resetPassword(model));
  }
}
