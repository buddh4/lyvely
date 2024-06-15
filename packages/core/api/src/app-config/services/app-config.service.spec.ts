import { buildTest, ILyvelyTestingModule } from '@/testing';
import { INestApplication, Injectable, Module } from '@nestjs/common';
import { AppConfigService } from '@/app-config/services/app-config.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_MODULE_APP_CONFIG_ASSEMBLY, ModuleAppConfigAssemblyEvent } from '@/app-config';
import { IAppConfig } from '@lyvely/interface';

describe('AppConfigService', () => {
  let testingModule: ILyvelyTestingModule;
  let appConfigService: AppConfigService;

  @Injectable()
  class TestModuleEvents {
    @OnEvent(EVENT_MODULE_APP_CONFIG_ASSEMBLY)
    handleModuleConfigAssembly(event: ModuleAppConfigAssemblyEvent) {
      event.setModuleConfig('test', { someConfig: true });
    }
  }

  @Module({
    providers: [TestModuleEvents],
  })
  class TestModule {}

  beforeEach(async () => {
    testingModule = await buildTest('AppConfigService')
      .imports([TestModule])
      .providers([AppConfigService])
      .withApp()
      .compile();
    appConfigService = testingModule.get(AppConfigService);
  });

  afterEach(async () => {
    await testingModule.afterEach();
  });

  describe('getAppConfig', () => {
    it('inject module config', async () => {
      const config: IAppConfig<{ test: { someConfig: boolean } }> = appConfigService.getAppConfig(<any>{});
      expect(config.modules.test.someConfig).toEqual(true);
    });
  });
});
