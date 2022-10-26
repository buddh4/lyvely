import { Test, TestingModule } from '@nestjs/testing';
import { CaptchaController } from './captcha.controller';
import { expect } from '@jest/globals';
import { createBasicTestingModule } from '../../test';
import { CaptchaModule } from '../captcha.module';

describe('CaptchaController', () => {
  let controller: CaptchaController;

  beforeEach(async () => {
    const module: TestingModule = await createBasicTestingModule('account-service', [], [], [CaptchaModule]).compile();
    controller = module.get<CaptchaController>(CaptchaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
