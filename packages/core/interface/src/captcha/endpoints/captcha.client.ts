import { ICaptchaService } from './captcha.endpoint';
import { CaptchaChallenge } from '../models';
import { useSingleton } from '@lyvely/common';
import captchaRepository from './captcha.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@/endpoints';

export class CaptchaClient implements ICaptchaService {
  async challenge() {
    return unwrapAndTransformResponse(captchaRepository.createChallenge(), CaptchaChallenge);
  }

  async refresh(identity: string) {
    return unwrapResponse(captchaRepository.refresh(identity));
  }
}

export const useCaptchaClient = useSingleton(() => new CaptchaClient());
