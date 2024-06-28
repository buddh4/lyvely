import { createCoreTestingModule, type ICoreTestModule } from '@/core/testing';
import { type ITenancyOptions, TenancyIsolation } from '@/core/tenancy';
import { LyvelyConfigService } from '@/config';
import { ClsService } from 'nestjs-cls';
import { getObjectId } from '@/testing';

describe('LyvelyConfigService', () => {
  let testingModule: ICoreTestModule;
  let configService: LyvelyConfigService;
  let clsService: ClsService;

  const initModule = async (
    isolation: TenancyIsolation,
    config?: Partial<ITenancyOptions>
  ): Promise<void> => {
    testingModule = await createCoreTestingModule('LyvelyConfigService', {
      config: {
        tenancy: {
          isolation,
          ...config,
        },
      },
    }).compile();

    configService = testingModule.get(LyvelyConfigService);
    clsService = testingModule.get(ClsService);
  };

  afterEach(async () => {
    await testingModule.afterEach();
  });

  describe('get', () => {
    it('Return tenancy config if strict isolation is active', async () => {
      const tenancyId = getObjectId('test').toString();
      await initModule(TenancyIsolation.Strict, {
        tenants: [
          {
            id: tenancyId,
            config: {
              i18n: {
                defaultLocale: 'de',
              },
            },
          },
        ],
      });

      jest.spyOn(clsService, 'get').mockImplementation(() => tenancyId);

      expect(configService.get('i18n')).toEqual({
        defaultLocale: 'de',
      });
    });

    it('Do not return tenancy config if strict isolation is not active', async () => {
      const tenancyId = getObjectId('test').toString();
      await initModule(TenancyIsolation.Profile, {
        tenants: [
          {
            id: tenancyId,
            config: {
              i18n: {
                defaultLocale: 'de',
              },
            },
          },
        ],
      });

      jest.spyOn(clsService, 'get').mockImplementation(() => tenancyId);

      expect(configService.get('i18n')).not.toEqual({
        defaultLocale: 'de',
      });
    });
  });

  describe('getModuleConfig', () => {
    it('Return tenancy config if strict isolation is active', async () => {
      const tenancyId = getObjectId('test').toString();
      await initModule(TenancyIsolation.Strict, {
        tenants: [
          {
            id: tenancyId,
            config: {
              modules: {
                test: {
                  value: 'MyTenancyValue',
                },
              },
            },
          },
        ],
      });

      jest.spyOn(clsService, 'get').mockImplementation(() => tenancyId);

      expect(configService.getModuleConfig('test', 'value')).toEqual('MyTenancyValue');
    });

    it('Do not return tenancy config if strict isolation is not active', async () => {
      const tenancyId = getObjectId('test').toString();
      await initModule(TenancyIsolation.Profile, {
        tenants: [
          {
            id: tenancyId,
            config: {
              modules: {
                test: {
                  value: 'MyTenancyValue',
                },
              },
            },
          },
        ],
      });

      jest.spyOn(clsService, 'get').mockImplementation(() => tenancyId);

      expect(configService.getModuleConfig('test', 'value')).toBeUndefined();
    });
  });
});
