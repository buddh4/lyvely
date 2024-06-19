import { createCoreTestingModule, getObjectId, type ICoreTestModule } from '../testing';
import { TenancyIsolation } from '@/core/tenancy/tenancy-isolation.enum';
import { TenancyService } from '@/core/tenancy/tenancy.service';
import type { ITenancyOptions } from '@/core';
import type { ITenant } from '@/core/tenancy/tenant.interface';

describe('TenancyService', () => {
  let testingModule: ICoreTestModule;
  let tenancyService: TenancyService;

  afterEach(async () => {
    await testingModule?.afterEach();
  });

  const initTest = async (options?: ITenancyOptions): Promise<void> => {
    testingModule = await createCoreTestingModule('TenancyService', {
      config: { tenancy: options },
      providers: [TenancyService],
    }).compile();

    tenancyService = testingModule.get(TenancyService);
  };

  describe('isIsolatedTenant', () => {
    it('do not isolate tenant if isolation level is none', async () => {
      await initTest({ isolation: TenancyIsolation.None });
      expect(tenancyService.isIsolatedTenant(getObjectId('someOid'))).toEqual(false);
    });

    it('isolate tenant if isolation level is strict', async () => {
      await initTest({ isolation: TenancyIsolation.Strict });
      expect(tenancyService.isIsolatedTenant(getObjectId('someOid'))).toEqual(true);
    });

    it('isolate tenant if isolation level is profile and is configured tenant', async () => {
      const tenantId = getObjectId('tenant1');
      await initTest({
        isolation: TenancyIsolation.Profile,
        tenants: [{ id: tenantId.toString() }],
      });
      expect(tenancyService.isIsolatedTenant(tenantId)).toEqual(true);
      expect(tenancyService.isIsolatedTenant(tenantId.toString())).toEqual(true);
    });

    it('do not isolate tenant if isolation level is profile and is not a configured tenant', async () => {
      await initTest({
        isolation: TenancyIsolation.Profile,
        tenants: [{ id: getObjectId('tenant1').toString() }],
      });
      expect(tenancyService.isIsolatedTenant(getObjectId('tenant2'))).toEqual(false);
      expect(tenancyService.isIsolatedTenant(getObjectId('tenant2').toString())).toEqual(false);
    });
  });

  describe('getTenancyDb', () => {
    it('test default prefix', async () => {
      await initTest();
      expect(tenancyService.getTenancyDb('b9f08bd502a887fe2634e484')).toEqual(
        'lyvely-b9f08bd502a887fe2634e484'
      );
    });

    it('overwrite default prefix', async () => {
      await initTest({ isolation: TenancyIsolation.Profile, collectionPrefix: 'tenant-' });
      expect(tenancyService.getTenancyDb('b9f08bd502a887fe2634e484')).toEqual(
        'tenant-b9f08bd502a887fe2634e484'
      );
    });
  });

  describe('getIsolationLevel', () => {
    it('return tenancy isolation none as default', async () => {
      await initTest();
      expect(tenancyService.getIsolationLevel()).toEqual(TenancyIsolation.None);
    });

    it('return configured tenancy isolation', async () => {
      await initTest({ isolation: TenancyIsolation.Profile });
      expect(tenancyService.getIsolationLevel()).toEqual(TenancyIsolation.Profile);
    });
  });

  describe('getTenants', () => {
    it('return empty array by default', async () => {
      await initTest();
      expect(tenancyService.getTenants()).toEqual([]);
    });

    it('return configured tenants', async () => {
      const tenants: ITenant[] = [{ id: 'b9f08bd502a887fe2634e484' }];
      await initTest({ isolation: TenancyIsolation.Profile, tenants });
      expect(tenancyService.getTenants()).toEqual(tenants);
    });
  });
});
