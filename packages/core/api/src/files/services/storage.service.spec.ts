import { buildTest, ILyvelyTestingModule, TestConfigService } from '@/testing';
import { ConfigService } from '@nestjs/config';
import type { IStorageConfig } from '../../config';
import { StorageProvider } from '../providers';
import { FileUpload } from '../models';
import type { FileAccess } from '../interfaces';
import stream from 'node:stream';
import { DEFAULT_REGION, uniqueGuid } from '@/core';
import { StorageService } from './storage.service';
import { FileMimeTypeRegistry } from '../registries';
import { ModuleRef } from '@nestjs/core';
import { GenericFile } from '../schemas';

describe('StorageService', () => {
  let testingModule: ILyvelyTestingModule;
  let configService: TestConfigService;
  let moduleRef: ModuleRef;

  const TEST_KEY = 'StorageService';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY).compile();
    configService = testingModule.get(ConfigService);
    moduleRef = testingModule.get(ModuleRef);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  class TestProvider extends StorageProvider<any> {
    async upload(upload: FileUpload): Promise<void> {
      /** Nothing to do **/
    }

    async delete(file: FileAccess): Promise<void> {
      /** Nothing to do **/
    }

    async download(file: FileAccess): Promise<stream.Readable | null> {
      return null;
    }

    async initialize() {
      /** Nothing to do **/
    }
  }

  describe('upload', () => {
    it('image mime should produce image file', async () => {
      expect.assertions(4);

      configService.set('module.files.storage', {
        default: 'TestProvider',
        providers: [{ id: 'TestProvider', class: TestProvider }],
      } as IStorageConfig);

      const upload = new FileUpload(<any>{
        guid: uniqueGuid(),
        bucket: 'test',
        file: <any>{ mimetype: 'image/jpeg' },
      });

      class TestImageFile extends GenericFile {
        afterInit() {
          expect(this.guid).toEqual(upload.guid);
          expect(this.bucket).toEqual(upload.bucket);
          expect(this.region).toEqual(DEFAULT_REGION);
        }
      }

      const registry = new FileMimeTypeRegistry();
      registry.registerType(TestImageFile, 'image/jpeg');

      const storageService = new StorageService(registry, <any>configService, moduleRef);
      const file = await storageService.upload(upload);
      expect(file instanceof TestImageFile).toEqual(true);
    });

    it('configuration of multiple buckets should work', async () => {
      expect.assertions(1);
      class ProviderA extends TestProvider {}
      class ProviderB extends TestProvider {
        override async upload(upload: FileUpload): Promise<void> {
          expect(this.options).toEqual({ test: 'b' });
        }
      }
      configService.set('module.files.storage', {
        default: 'AStorage',
        providers: [
          { id: 'AStorage', class: ProviderA, options: { test: 'a' } },
          { id: 'BStorage', class: ProviderB, options: { test: 'b' } },
        ],
        buckets: [{ name: 'test', storage: 'BStorage' }],
      } as IStorageConfig);

      const storageService = new StorageService(
        new FileMimeTypeRegistry(),
        <any>configService,
        moduleRef
      );

      await storageService.upload(
        new FileUpload(<any>{
          guid: uniqueGuid(),
          bucket: 'test',
          file: <any>{ mimetype: 'image/jpeg' },
        })
      );
    });

    it('default provider should be used if no bucket configuration matches', async () => {
      expect.assertions(1);
      class ProviderA extends TestProvider {
        override async upload(upload: FileUpload): Promise<void> {
          expect(this.options).toEqual({ test: 'a' });
        }
      }
      class ProviderB extends TestProvider {}
      configService.set('module.files.storage', {
        default: 'AStorage',
        providers: [
          { id: 'AStorage', class: ProviderA, options: { test: 'a' } },
          { id: 'BStorage', class: ProviderB, options: { test: 'b' } },
        ],
        buckets: [{ name: 'test', storage: 'BStorage' }],
      } as IStorageConfig);

      const storageService = new StorageService(
        new FileMimeTypeRegistry(),
        <any>configService,
        moduleRef
      );

      await storageService.upload(
        new FileUpload(<any>{
          guid: uniqueGuid(),
          bucket: 'unknown',
          file: <any>{ mimetype: 'image/jpeg' },
        })
      );
    });
  });
});
