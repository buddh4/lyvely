import { AbstractDao, Model } from '@/core';
import { Captcha } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';

export class CaptchaDao extends AbstractDao<Captcha> {
  constructor(@InjectModel(Captcha.name) protected model: Model<Captcha>) {
    super();
  }

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
