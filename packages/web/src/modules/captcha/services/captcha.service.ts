import { ICaptchaService, useSingleton } from '@lyvely/common';
import captchaRepository from '@/modules/captcha/repositories/captcha.repository';
import { unwrapResponse } from '@/modules/core';

export class CaptchaService implements ICaptchaService {
  async challenge() {
    return unwrapResponse(captchaRepository.createChallenge());
  }

  async refresh(identity: string) {
    return unwrapResponse(captchaRepository.refresh(identity));
  }
}

export const useCaptchaService = useSingleton(() => new CaptchaService());
