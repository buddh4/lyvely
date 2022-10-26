import { TestingModule } from '@nestjs/testing';
import { CaptchaService } from './captcha.service';
import { expect } from '@jest/globals';
import { createBasicTestingModule } from '../../test';
import { CaptchaModule } from '../captcha.module';

describe('CaptchaService', () => {
  let service: CaptchaService;

  beforeEach(async () => {
    const module: TestingModule = await createBasicTestingModule('account-service', [], [], [CaptchaModule]).compile();
    service = module.get<CaptchaService>(CaptchaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
