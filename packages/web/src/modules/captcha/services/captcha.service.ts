import { ICaptchaService, useSingleton, CaptchaChallenge } from '@lyvely/common';
import captchaRepository from '@/modules/captcha/repositories/captcha.repository';
import { unwrapAndCastResponse, unwrapResponse } from '@/modules/core';

export class CaptchaService implements ICaptchaService {
  async challenge() {
    return unwrapAndCastResponse(captchaRepository.createChallenge(), CaptchaChallenge);
  }

  async refresh(identity: string) {
    return unwrapResponse(captchaRepository.refresh(identity));
  }
}

export const useCaptchaService = useSingleton(() => new CaptchaService());
