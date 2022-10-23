import repository from '@/repository';
import { ENDPOINT_CAPTCHA, ICaptchaService, EndpointResult } from '@lyvely/common';

const resource = ENDPOINT_CAPTCHA;

export default {
  async createChallenge() {
    return repository.post<EndpointResult<ICaptchaService['challenge']>>(`${resource}`);
  },

  async refresh(identity: string) {
    return repository.post<EndpointResult<ICaptchaService['refresh']>>(`${resource}/refresh`, { identity });
  },
};
