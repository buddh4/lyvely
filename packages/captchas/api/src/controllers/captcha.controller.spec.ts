import { TestingModule } from '@nestjs/testing';
import { CaptchaController } from './captcha.controller';
import { CaptchaModule } from '../captcha.module';
import { buildTest } from '@lyvely/testing';

describe('CaptchaController', () => {
  let controller: CaptchaController;

  beforeEach(async () => {
    const module: TestingModule = await buildTest('captcha-controller')
      .imports([CaptchaModule])
      .compile();
    controller = module.get<CaptchaController>(CaptchaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
