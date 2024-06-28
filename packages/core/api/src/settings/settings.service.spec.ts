import {
  AbstractDao,
  BaseDocument,
  Dao,
  DocumentIdentity,
  LeanDoc,
  MixedProp,
  type TObjectId,
} from '@/core';
import { buildTest, ILyvelyTestingModule } from '@/testing';
import { SettingsService } from './settings.service';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { SettingsRegistry } from './settings.registry';
import { type BaseModelData, type Type } from '@lyvely/common';
import { FieldValidationException } from '@lyvely/interface';

const settingRegistry = new SettingsRegistry();

@Schema()
class TestSettingTarget {
  @MixedProp({ default: () => ({}) })
  settings: Record<string, any>;

  id: string;

  _id: TObjectId;

  constructor(data: BaseModelData<TestSettingTarget>) {
    BaseDocument.init(this, data);
  }
}

const TestSettingTargetSchema = SchemaFactory.createForClass(TestSettingTarget);

@Dao(TestSettingTarget)
class TestSettingTargetDao extends AbstractDao<TestSettingTarget> {}

@Injectable()
class TestSettingsService extends SettingsService<TestSettingTarget> {
  protected logger = new Logger(TestSettingsService.name);
  protected settingsRegistry = settingRegistry;

  @Inject()
  protected settingsDao: TestSettingTargetDao;

  async save(model: TestSettingTarget): Promise<TestSettingTarget> {
    return this.settingsDao.save(model);
  }

  async find(identity: DocumentIdentity<TestSettingTarget>): Promise<TestSettingTarget | null> {
    return this.settingsDao.findById(identity);
  }
}

describe('SettingsService', () => {
  let settingsService: TestSettingsService;
  let testingModule: ILyvelyTestingModule;

  beforeEach(async () => {
    testingModule = await buildTest('SettingsService')
      .models([{ name: TestSettingTarget.name, schema: TestSettingTargetSchema }])
      .providers([TestSettingsService, TestSettingTargetDao])
      .compile();
    settingsService = testingModule.get(TestSettingsService);
  });

  afterEach(async () => {
    settingRegistry.clearSettings();
    return testingModule.afterEach();
  });

  describe('updateSettings', () => {
    it('update valid setting', async () => {
      settingRegistry.registerSettings([{ key: 'test.key', type: String }]);
      const model = await settingsService.save(new TestSettingTarget({}));
      const result = await settingsService.updateSettings(model, [
        { key: 'test.key', value: 'testValue' },
      ]);
      const updated = await settingsService.find(model);

      expect(result).toEqual(true);
      expect(model.settings).toBeDefined();
      expect(model.settings?.test?.key).toEqual('testValue');
      expect(updated?.settings?.test?.key).toEqual('testValue');
    });

    it('try update invalid setting type', async () => {
      settingRegistry.registerSettings([{ key: 'test.key', type: String }]);
      const model = await settingsService.save(new TestSettingTarget({}));

      expect.assertions(2);

      try {
        await settingsService.updateSettings(model, [{ key: 'test.key', value: 3 }]);
      } catch (e) {
        expect(e instanceof FieldValidationException).toEqual(true);
        expect((<FieldValidationException>e).getFields()[0].property).toEqual('test.key');
      }
    });

    it('try update invalid setting by validator', async () => {
      settingRegistry.registerSettings([
        {
          key: 'test.key',
          type: String,
          validator: (val: any) => ['test1', 'test2'].includes(val),
        },
      ]);
      const model = await settingsService.save(new TestSettingTarget({}));

      expect.assertions(2);

      try {
        await settingsService.updateSettings(model, [{ key: 'test.key', value: 3 }]);
      } catch (e) {
        expect(e instanceof FieldValidationException).toEqual(true);
        expect((<FieldValidationException>e).getFields()[0].property).toEqual('test.key');
      }
    });

    it('try update valid setting with validator', async () => {
      settingRegistry.registerSettings([
        {
          key: 'test.key',
          type: String,
          validator: (val: any) => ['test1', 'test2'].includes(val),
        },
      ]);
      const model = await settingsService.save(new TestSettingTarget({}));

      const result = await settingsService.updateSettings(model, [
        { key: 'test.key', value: 'test2' },
      ]);

      expect(result).toEqual(true);
      expect(model.settings).toBeDefined();
      expect(model.settings?.test?.key).toEqual('test2');
    });
  });
});
