import { repository } from '@/core';
import { EndpointResult } from '@lyvely/common';
import { ENDPOINT_CAPTCHA, ICaptchaService } from '@lyvely/core-interface';

const resource = ENDPOINT_CAPTCHA;

export default {
  async createChallenge() {
    return repository.post<EndpointResult<ICaptchaService['challenge']>>(`${resource}`);
  },

  async refresh(identity: string) {
    return repository.post<EndpointResult<ICaptchaService['refresh']>>(`${resource}/refresh`, {
      identity,
    });
  },
};