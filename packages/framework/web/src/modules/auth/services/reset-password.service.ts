import { IResetPasswordService, SendResetPasswordMail, ResetPassword } from '@lyvely/common';
import resetPasswordRepository from '@/modules/auth/repositories/reset-password.repository';
import { unwrapResponse } from '@/modules/core';

export class ResetPasswordService implements IResetPasswordService {
  async sendMail(model: SendResetPasswordMail) {
    return unwrapResponse(resetPasswordRepository.sendMail(model));
  }

  async resetPassword(model: ResetPassword) {
    return unwrapResponse(resetPasswordRepository.resetPassword(model));
  }
}
