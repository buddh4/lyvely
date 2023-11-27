import { Headers, IFieldValidationResponse, isFieldValidationError } from '@lyvely/interface';
import { useCaptchaStore } from './captcha.store';
import { InternalAxiosRequestConfig } from 'axios';
import { translate } from '@/i18n';

export const captchaInterceptor = (config: InternalAxiosRequestConfig) => {
  if (config.withCaptcha) {
    config.headers = config.headers || {};
    config.headers[Headers.X_CAPTCHA_TOKEN] = useCaptchaStore().getCaptchaValue();
    config.headers[Headers.X_CAPTCHA_ID] = useCaptchaStore().getCaptchaIdentity();
  }
  return config;
};

export const captchaResponseErrorInterceptor = (error: any) => {
  if (!error.config?.withCaptcha || !isFieldValidationError(error)) {
    return Promise.reject(error);
  }

  const validation = error.response.data as IFieldValidationResponse;

  const captchaError = validation.fields.find((field) => field.property === 'captcha');
  if (captchaError)
    useCaptchaStore().setCaptchaError({
      property: 'captcha',
      errors: [translate('captcha.errors.invalid')],
    });

  return Promise.reject(error);
};
