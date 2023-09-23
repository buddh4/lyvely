import { TestingModule } from '@nestjs/testing';
import { CaptchaService } from './captcha.service';
import { expect } from '@jest/globals';
import { CaptchaModule } from '../captcha.module';
import { buildTest } from '@lyvely/testing';

describe('CaptchaService', () => {
  let service: CaptchaService;

  beforeEach(async () => {
    const module: TestingModule = await buildTest('captcha-controller')
      .imports([CaptchaModule])
      .compile();
    service = module.get<CaptchaService>(CaptchaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
