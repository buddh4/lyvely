import { AbstractDao, Dao } from '@/core';
import { Captcha } from '../schemas';
import { TenancyIsolation } from '@/core/tenancy';

@Dao(Captcha, { isolation: TenancyIsolation.Strict })
export class CaptchaDao extends AbstractDao<Captcha> {
  protected modelName = Captcha.name;

  async findCaptchaByIdentity(identity: string) {
    return this.findOne({ identity: identity });
  }
}
