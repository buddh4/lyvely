import { AbstractDao } from '@lyvely/server-core';
import { Captcha, CaptchaDocument } from '../schemas/captcha.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class CaptchaDao extends AbstractDao<Captcha> {
  constructor(@InjectModel(Captcha.name) protected model: Model<CaptchaDocument>) {
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
