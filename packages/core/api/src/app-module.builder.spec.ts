import { AppModuleBuilder } from '@/app-module.builder';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

describe('AppModuleBuilder', () => {
  describe('build', () => {
    it('build app with default config', async () => {
      const testModule = await Test.createTestingModule({
        imports: [
          await new AppModuleBuilder({
            configFiles: ['testing/test.config.one.js'],
            loadDBConfig: false,
            manual: true,
          }).build(),
        ],
      }).compile();

      const configService = testModule.get<ConfigService>(ConfigService);
      expect(configService).toBeDefined();
      expect(configService.get('modules.test.value')).toEqual('testValue');
    });

    it('default configuration loads', async () => {
      const testModule = await Test.createTestingModule({
        imports: [
          await new AppModuleBuilder({
            configFiles: [],
            loadDBConfig: false,
            manual: true,
          }).build(),
        ],
      }).compile();

      const configService = testModule.get<ConfigService>(ConfigService);
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
              auth: {
                jwt: {
                  access: {
                    secret: 'testSecret',
                  },
                },
              },
            },
            manual: true,
          }).build(),
        ],
      }).compile();

      const configService = testModule.get<ConfigService>(ConfigService);
      expect(configService).toBeDefined();
      expect(configService.get('auth.jwt.access.secret')).toEqual('testSecret');
      expect(configService.get('auth.jwt.secure-cookies')).toEqual(true);
    });
  });
});
