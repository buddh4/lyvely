import { AbstractDao, Dao } from '@/core';
import { Captcha } from '../schemas';

@Dao(Captcha)
export class CaptchaDao extends AbstractDao<Captcha> {
  protected modelName = Captcha.name;

  async findCaptchaByIdentity(identity: string) {
    return this.findOne({ identity: identity });
  }
}
