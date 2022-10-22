import { BadRequestException, Injectable } from '@nestjs/common';
import { CaptchaDao } from '../daos/captcha.dao';
import { generateCaptcha, generateCaptchaToken } from '../utils/captcha.generator';
import { Captcha } from '../schemas/captcha.schema';
import bcrypt from 'bcrypt';

@Injectable()
export class CaptchaService {
  constructor(private captchaDao: CaptchaDao) {}

  async createCaptcha(identifier: string, purpose: string) {
    const token = generateCaptchaToken();
    const identity = await bcrypt.hash(identifier, 10);
    await this.captchaDao.save(new Captcha({ identity, token, purpose }));
    return identity;
  }

  async renderCaptchaImageByIdentity(identity: string) {
    // const captcha = await this.captchaDao.findCaptchaByIdentity(identity);
    //if (!captcha) throw new BadRequestException();

    const { image } = generateCaptcha();
    return image;
  }
}
