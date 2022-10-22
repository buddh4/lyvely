import { AbstractDao } from '@/core';
import { Captcha } from '../schemas/captcha.schema';

export class CaptchaDao extends AbstractDao<Captcha> {
  async findCaptchaByIdentity(identity: string) {
    return this.findOne({ identity: identity });
  }

  getModelConstructor() {
    return Captcha;
  }

  getModuleId(): string {
    return 'captcha';
  }
}
