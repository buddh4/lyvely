import { IModule } from '@/core';
import {
  CAPTCHA_MODULE_ID,
  useApiRequestInterceptor,
  useApiResponseInterceptor,
} from '@lyvely/interface';
import { captchaInterceptor, captchaResponseErrorInterceptor } from './captcha.interceptor';

export const captchaModule = () => {
  return {
    id: CAPTCHA_MODULE_ID,
    init() {
      useApiRequestInterceptor(captchaInterceptor);
      useApiResponseInterceptor(undefined, captchaResponseErrorInterceptor);
    },
  } as IModule;
};
