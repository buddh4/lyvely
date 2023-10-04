import { CaptchaController } from './captcha.controller';
import { CaptchaModule } from '../captcha.module';
import { buildTest, LyvelyTestingModule } from '@lyvely/testing';

describe('CaptchaController', () => {
  let controller: CaptchaController;
  let testingModule: LyvelyTestingModule;

  beforeEach(async () => {
    testingModule = await buildTest('captcha-controller').imports([CaptchaModule]).compile();
    controller = testingModule.get(CaptchaController);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
