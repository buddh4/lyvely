import { ICaptchaService } from './captcha.endpoint';
import { CaptchaChallenge } from '../models';
import { useSingleton } from '@lyvely/common';
import captchaRepository from './captcha.repository';
import { IProfileApiRequestOptions, unwrapAndTransformResponse, unwrapResponse } from '@/endpoints';

export class CaptchaClient implements ICaptchaService {
  async challenge(options?: IProfileApiRequestOptions) {
    return unwrapAndTransformResponse(captchaRepository.createChallenge(options), CaptchaChallenge);
  }

  async refresh(identity: string, options?: IProfileApiRequestOptions) {
    return unwrapResponse(captchaRepository.refresh(identity, options));
  }
}

export const useCaptchaClient = useSingleton(() => new CaptchaClient());
