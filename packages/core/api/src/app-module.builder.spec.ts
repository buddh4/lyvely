import { AppModuleBuilder } from '@/app-module.builder';
import { Test } from '@nestjs/testing';
import { LyvelyConfigService } from '@/config';
import type { AuthModuleConfig, ModuleConfig } from '@/core';

describe('AppModuleBuilder', () => {
  describe('build', () => {
    it('build app with default config', async () => {
      const testModule = await Test.createTestingModule({
        imports: [
          await new AppModuleBuilder({
            configFiles: ['testing/test.config.one.js'],
            loadDBConfig: false,
            manual: true,
          }).importClsModule().importEventEmitterModule().build(),
        ],
      }).compile();

      const configService =
        testModule.get<LyvelyConfigService<ModuleConfig<'test', { value: string }>>>(
          LyvelyConfigService
        );
      expect(configService).toBeDefined();
      expect(configService.getModuleConfig('test', 'value')).toEqual('testValue');
    });

    it('default configuration loads', async () => {
      const testModule = await Test.createTestingModule({
        imports: [
          await new AppModuleBuilder({
            configFiles: [],
            loadDBConfig: false,
            manual: true,
          }).importClsModule().importEventEmitterModule().build(),
        ],
      }).compile();

      const configService = testModule.get<LyvelyConfigService>(LyvelyConfigService);
      expect(configService).toBeDefined();
      expect(configService.get('http.port')).toEqual(8080);
    });

    it('overwrite and merge configuration', async () => {
      const testModule = await Test.createTestingModule({
        imports: [
          await new AppModuleBuilder({
            configFiles: [],
            loadDBConfig: false,
            config: {
              modules: {
                auth: {
                  jwt: {
                    access: {
                      secret: 'testSecret',
                    },
                  },
                },
              },
            },
            manual: true,
          }).importClsModule().importEventEmitterModule().build(),
        ],
      }).compile();

      const configService =
        testModule.get<LyvelyConfigService<AuthModuleConfig>>(LyvelyConfigService);
      expect(configService).toBeDefined();
      expect(configService.getModuleConfig('auth', 'jwt.access.secret')).toEqual('testSecret');
      expect(configService.getModuleConfig('auth', 'jwt.secure-cookies')).toEqual(true);
    });
  });
});
