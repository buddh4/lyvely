import { IResetPasswordService, SendResetPasswordMail, ResetPassword } from '@lyvely/common';
import resetPasswordRepository from '@/modules/auth/repositories/reset-password.repository';
import { unwrapEndpointRequest } from '@/modules/core';

export class ResetPasswordService implements IResetPasswordService {
  async sendMail(model: SendResetPasswordMail) {
    return unwrapEndpointRequest(resetPasswordRepository.sendMail(model));
  }

  async resetPassword(model: ResetPassword) {
    return unwrapEndpointRequest(resetPasswordRepository.resetPassword(model));
  }
}
