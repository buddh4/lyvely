import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDao } from './abstract.dao';
import { TObjectId } from '../interfaces';
import { createCoreTestingModule, type ICoreTestModule, } from '../../testing/core-test.util';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { Dao } from "./dao.decorator";
import { TenancyException, TenancyIsolation } from "@/core/tenancy";
import { getObjectId } from "@/testing";
import type { ITenancyOptions } from "@/config";

@Schema()
class TestDocument {
  _id: TObjectId;
  id: string;
}

const TestDocumentSchema = SchemaFactory.createForClass(TestDocument);


@Dao(TestDocument, {
  isolation: TenancyIsolation.Profile
})
class ProfileIsolationDao extends AbstractDao<TestDocument> {}

@Dao(TestDocument, {
  isolation: TenancyIsolation.Strict
})
class StrictIsolationDao extends AbstractDao<TestDocument> {}

@Dao(TestDocument, {
  isolation: TenancyIsolation.None
})
class MainDao extends AbstractDao<TestDocument> {}

const TestDocumentModelDefinition: ModelDefinition = {
  name: TestDocument.name,
  schema: TestDocumentSchema
};

describe('AbstractDao - tenancy', () => {
  let testingModule: ICoreTestModule;
  let strictIsolationDao: StrictIsolationDao;
  let profileIsolationDao: ProfileIsolationDao;
  let mainDao: MainDao;

  const initModule = async (isolation: TenancyIsolation, config?: Partial<ITenancyOptions>): Promise<void> => {
    testingModule = await createCoreTestingModule(
      'AbstractDao',
      {
        providers: [MainDao, ProfileIsolationDao, StrictIsolationDao],
        models:  [TestDocumentModelDefinition],
        config: {
          tenancy: {
            isolation,
            ...config
          }
        }
      }
    ).compile();

    strictIsolationDao = testingModule.get(StrictIsolationDao);
    profileIsolationDao = testingModule.get(ProfileIsolationDao);
    mainDao = testingModule.get(MainDao);
  }

  afterEach(async () => {
    await testingModule.afterEach();
  });

  describe('Dao with TenancyIsolation.None', () => {
    it('Document persisted in main db with isolation None', async () => {
      await initModule(TenancyIsolation.None);
      const document = await mainDao.save(new TestDocument());
      expect(document?._id).toBeDefined();
    });

    it('Document is not isolated on Strict isolation level', async () => {
      await initModule(TenancyIsolation.Strict);
      const document = await mainDao.save(new TestDocument());
      expect(document?._id).toBeDefined();
      const isolatedDocument = await strictIsolationDao.findById(document, { tenancyId: getObjectId('tenant1') });
      expect(isolatedDocument).toBeNull();
    });

    it('Document is not isolated on Profile isolation level', async () => {
      const tenantId = getObjectId('tenant1');
      await initModule(TenancyIsolation.Profile, { tenants: [{ oid: tenantId.toString() }] });
      const document = await mainDao.save(new TestDocument());
      expect(document?._id).toBeDefined();
      const isolatedDocument = await profileIsolationDao.findById(document, { tenancyId: tenantId });
      expect(isolatedDocument).toBeNull();
    });
  });

  describe('Dao with TenancyIsolation.Profile', () => {
    it('Document is persisted in main db with isolation None', async () => {
      await initModule(TenancyIsolation.None);
      const document = await profileIsolationDao.save(new TestDocument());
      expect(await mainDao.reload(document)).toBeDefined();
    });

    it('TenantId required on Profile level isolation', async () => {
      await initModule(TenancyIsolation.Profile);
      expect.assertions(1);

      profileIsolationDao.save(new TestDocument()).catch((e) => {
        expect(e instanceof TenancyException).toEqual(true);
      })
    });

    it('TenantId required on Strict level isolation', async () => {
      await initModule(TenancyIsolation.Strict);
      expect.assertions(1);

      profileIsolationDao.save(new TestDocument()).catch((e) => {
        expect(e instanceof TenancyException).toEqual(true);
      })
    });

    it('Document is isolated on Profile isolation level', async () => {
      const tenantId = getObjectId('tenant1');
      await initModule(TenancyIsolation.Profile, { tenants: [{ oid: tenantId.toString() }] });
      const document = await profileIsolationDao.save(new TestDocument(), { tenancyId: tenantId });
      expect(document).toBeDefined();

      const mainDBSearch = await mainDao.findById(document);
      expect(mainDBSearch).toBeNull();
    });

    it('Document is isolated on Strict isolation level', async () => {
      const tenantId = getObjectId('tenant1');
      await initModule(TenancyIsolation.Strict, { tenants: [{ oid: tenantId.toString() }] });
      const document = await profileIsolationDao.save(new TestDocument(), { tenancyId: tenantId });
      expect(document).toBeDefined();
      const mainDBSearch = await mainDao.findById(document);
      expect(mainDBSearch).toBeNull();
    });
  });

  describe('Dao with TenancyIsolation.Profile', () => {
    it('Document is persisted in main db with isolation None', async () => {
      await initModule(TenancyIsolation.None);
      const document = await strictIsolationDao.save(new TestDocument());
      expect(await mainDao.reload(document)).toBeDefined();
    });

    it('TenantId not required on Profile level isolation', async () => {
      await initModule(TenancyIsolation.Profile);

      const document = await strictIsolationDao.save(new TestDocument());
      expect(document).toBeDefined();
    });

    it('TenantId required on Strict level isolation', async () => {
      await initModule(TenancyIsolation.Strict);
      expect.assertions(1);

      strictIsolationDao.save(new TestDocument()).catch((e) => {
        expect(e instanceof TenancyException).toEqual(true);
      })
    });

    it('Document is not isolated on Profile isolation level', async () => {
      const tenantId = getObjectId('tenant1');
      await initModule(TenancyIsolation.Profile, { tenants: [{ oid: tenantId.toString() }] });
      const document = await strictIsolationDao.save(new TestDocument(), { tenancyId: tenantId });
      expect(document).toBeDefined();

      const mainDBSearch = await mainDao.findById(document);
      expect(mainDBSearch).toBeDefined();
    });

    it('Document is isolated on Strict isolation level', async () => {
      const tenantId = getObjectId('tenant1');
      await initModule(TenancyIsolation.Strict, { tenants: [{ oid: tenantId.toString() }] });
      const document = await strictIsolationDao.save(new TestDocument(), { tenancyId: tenantId });
      expect(document).toBeDefined();
      const mainDBSearch = await mainDao.findById(document);
      expect(mainDBSearch).toBeNull();
    });
  });
});
