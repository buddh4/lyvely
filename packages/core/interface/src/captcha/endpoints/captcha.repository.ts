import { CaptchaEndpointPaths, ENDPOINT_CAPTCHA, ICaptchaService } from './captcha.endpoint';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';

const api = useApi<ICaptchaService>(ENDPOINT_CAPTCHA);

export default {
  async createChallenge(options?: IProfileApiRequestOptions) {
    return api.post<'challenge'>({}, options);
  },

  async refresh(identity: string, options?: IProfileApiRequestOptions) {
    return api.post<'refresh'>(
      CaptchaEndpointPaths.REFRESH,
      {
        identity,
      },
      options,
    );
  },
};
