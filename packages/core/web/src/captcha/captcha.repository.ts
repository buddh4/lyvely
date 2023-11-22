import { EndpointResult } from '@lyvely/common';
import { ENDPOINT_CAPTCHA, ICaptchaService, useApiRepository } from '@lyvely/interface';

const resource = ENDPOINT_CAPTCHA;

export default {
  async createChallenge() {
    return useApiRepository().post<EndpointResult<ICaptchaService['challenge']>>(`${resource}`);
  },

  async refresh(identity: string) {
    return useApiRepository().post<EndpointResult<ICaptchaService['refresh']>>(
      `${resource}/refresh`,
      {
        identity,
      },
    );
  },
};
