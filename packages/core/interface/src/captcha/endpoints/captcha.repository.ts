import { CaptchaEndpointPaths, ENDPOINT_CAPTCHA, ICaptchaService } from './captcha.endpoint';
import { useApi } from '@/repository';

const api = useApi<ICaptchaService>(ENDPOINT_CAPTCHA);

export default {
  async createChallenge() {
    return api.post<'challenge'>();
  },

  async refresh(identity: string) {
    return api.post<'refresh'>(CaptchaEndpointPaths.REFRESH, {
      identity,
    });
  },
};
