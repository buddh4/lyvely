import { AbstractDao } from '@/core';
import { Captcha } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
