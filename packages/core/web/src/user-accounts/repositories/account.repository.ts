import { repository } from '@/core';
import {
  AddEmailDto,
  VerifyEmailDto,
  IAccountService,
  ENDPOINT_ACCOUNT,
  ResendOtp,
} from '@lyvely/core-interface';
import { EndpointResult } from '@lyvely/common';

const resource = ENDPOINT_ACCOUNT;

export const accountRepository = {
  async addEmail(model: AddEmailDto) {
    return repository.post<EndpointResult<IAccountService['addEmail']>>(
      `${resource}/add-email`,
      model,
    );
  },

  async verifyEmail(model: VerifyEmailDto) {
    return repository.post<EndpointResult<IAccountService['verifyEmail']>>(
      `${resource}/verify-email`,
      model,
    );
  },

  async resendOtp(model: ResendOtp) {
    return repository.post<EndpointResult<IAccountService['resendOtp']>>(
      `${resource}/resend-otp`,
      model,
    );
  },

  async updateAvatar(fileData: Blob) {
    const file = new File([fileData], 'avatar.jpeg', { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('file', file, 'avatar.jpeg');
    return repository.post<EndpointResult<IAccountService['updateAvatar']>>(
      `${resource}/update-avatar`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
  },

  async updateGravatar() {
    return repository.post<EndpointResult<IAccountService['updateGravatar']>>(
      `${resource}/update-gravatar`,
    );
  },
};
