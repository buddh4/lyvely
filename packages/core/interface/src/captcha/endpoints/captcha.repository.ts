import { CaptchaEndpoints, API_CAPTCHA, ICaptchaService } from './captcha.endpoint';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'axios';

const api = useApi<ICaptchaService>(API_CAPTCHA);

export default {
  async createChallenge(options?: IProfileApiRequestOptions) {
    return api.post<'challenge'>({}, options);
  },

  async refresh(identity: string, options?: IProfileApiRequestOptions) {
    return api.post<'refresh'>(
      CaptchaEndpoints.REFRESH,
      {
        identity,
      },
      options,
    );
  },
};
