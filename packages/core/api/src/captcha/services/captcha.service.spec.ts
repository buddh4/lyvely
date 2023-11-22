import { CaptchaService } from './captcha.service';
import { CaptchaModule } from '../captcha.module';
import { buildTest, LyvelyTestingModule } from '@/testing';

describe('CaptchaService', () => {
  let service: CaptchaService;
  let testingModule: LyvelyTestingModule;

  beforeEach(async () => {
    testingModule = await buildTest('captcha-controller').imports([CaptchaModule]).compile();
    service = testingModule.get(CaptchaService);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
