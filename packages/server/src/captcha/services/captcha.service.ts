import { BadRequestException, Injectable } from '@nestjs/common';
import { CaptchaDao } from '../daos/captcha.dao';
import { generateCaptcha, generateCaptchaToken } from '../utils/captcha.generator';
import { Captcha } from '../schemas/captcha.schema';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { CaptchaChallenge } from '@lyvely/common';
import ms from 'ms';
import { UrlGenerator } from '@/core';

@Injectable()
export class CaptchaService {
  constructor(private captchaDao: CaptchaDao, private urlGenerator: UrlGenerator) {}

  async createCaptcha(): Promise<CaptchaChallenge> {
    const token = generateCaptchaToken();
    const identity = await bcrypt.hash(randomUUID(), 10);
    await this.captchaDao.save(new Captcha({ identity, token }));

    return new CaptchaChallenge({
      identity,
      imageUrl: this.urlGenerator.getApiUrl('/captcha', { identity }).href,
      issuedAt: new Date(),
      expiresIn: ms('2m'),
    });
  }

  async refresh(identity: string) {
    const captcha = await this.captchaDao.findCaptchaByIdentity(identity);
    if (!captcha) throw new BadRequestException();

    const token = generateCaptchaToken();
    await this.captchaDao.updateOneById(captcha, { token });
  }

  async render(identity: string) {
    const captcha = await this.captchaDao.findCaptchaByIdentity(identity);
    if (!captcha) throw new BadRequestException();

    const { image } = generateCaptcha({ token: captcha.token, theme: 'dark' });
    return image;
  }
}