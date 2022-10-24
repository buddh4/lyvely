import { IResetPasswordService, SendResetPasswordMailModel } from '@lyvely/common';
import resetPasswordRepository from '@/modules/auth/repositories/reset-password.repository';
import { unwrapEndpointRequest } from '@/modules/core';

export class ResetPasswordService implements IResetPasswordService {
  async sendMail(model: SendResetPasswordMailModel) {
    return unwrapEndpointRequest(resetPasswordRepository.sendMail(model));
  }
}
