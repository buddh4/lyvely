import { ICaptchaService, CaptchaChallenge } from '@lyvely/core-interface';
import { useSingleton } from '@lyvely/common';
import captchaRepository from '@/captcha/repositories/captcha.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@/core';

export class CaptchaService implements ICaptchaService {
  async challenge() {
    return unwrapAndTransformResponse(captchaRepository.createChallenge(), CaptchaChallenge);
  }

  async refresh(identity: string) {
    return unwrapResponse(captchaRepository.refresh(identity));
  }
}

export const useCaptchaService = useSingleton(() => new CaptchaService());
