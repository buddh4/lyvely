import { ICaptchaService, useSingleton } from "@lyvely/common";
import captchaRepository from "@/modules/captcha/repositories/captcha.repository";
import { unwrapEndpointRequest } from "@/modules/core";

export class CaptchaService implements ICaptchaService {
  async challenge() {
    return unwrapEndpointRequest(captchaRepository.createChallenge());
  }

  async refresh(identity: string) {
    return unwrapEndpointRequest(captchaRepository.refresh(identity));
  }
}

export const useCaptchaService = useSingleton(() => new CaptchaService());
