import { AbstractDao, BaseEntity, EntityIdentity, MixedProp, Model } from '@/core';
import { buildTest, LyvelyTestingModule } from '@/testing';
import { SettingsService } from './settings.service';
import { InjectModel, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { clearSettings, registerSettings } from './settings.registry';
import { Constructor, DeepPartial, FieldValidationException } from '@lyvely/common';

@Schema()
class TestSettingTarget extends BaseEntity<TestSettingTarget> {
  @MixedProp({ default: {} })
  settings: Record<string, any>;
}

const TestSettingTargetSchema = SchemaFactory.createForClass(TestSettingTarget);

@Injectable()
class TestSettingTargetDao extends AbstractDao<TestSettingTarget> {
  @InjectModel(TestSettingTarget.name)
  protected model: Model<TestSettingTarget>;

  getModelConstructor(model: DeepPartial<TestSettingTarget>): Constructor<TestSettingTarget> {
    return TestSettingTarget;
  }

  getModuleId(): string {
    return 'test';
  }
}

@Injectable()
class TestSettingsService extends SettingsService<TestSettingTarget> {
  protected logger = new Logger(TestSettingsService.name);

  @Inject()
  protected settingsDao: TestSettingTargetDao;

  async save(model: TestSettingTarget): Promise<TestSettingTarget> {
    return this.settingsDao.save(model);
  }

  async find(identity: EntityIdentity<TestSettingTarget>): Promise<TestSettingTarget | null> {
    return this.settingsDao.findById(identity);
  }
}

describe('SettingsService', () => {
  let settingsService: TestSettingsService;
  let testingModule: LyvelyTestingModule;

  beforeEach(async () => {
    testingModule = await buildTest('SettingsService')
      .models([{ name: TestSettingTarget.name, schema: TestSettingTargetSchema }])
      .providers([TestSettingsService, TestSettingTargetDao])
      .compile();
    settingsService = testingModule.get(TestSettingsService);
  });

  afterEach(async () => {
    clearSettings();
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  describe('updateSettings', () => {
    it('update valid setting', async () => {
      registerSettings([{ key: 'test.key', type: String }]);
      const model = await settingsService.save(new TestSettingTarget());
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
      registerSettings([{ key: 'test.key', type: String }]);
      const model = await settingsService.save(new TestSettingTarget());

      expect.assertions(2);

      try {
        await settingsService.updateSettings(model, [{ key: 'test.key', value: 3 }]);
      } catch (e) {
        expect(e instanceof FieldValidationException).toEqual(true);
        expect((<FieldValidationException>e).getFields()[0].property).toEqual('test.key');
      }
    });

    it('try update invalid setting by validator', async () => {
      registerSettings([
        {
          key: 'test.key',
          type: String,
          validator: (val: any) => ['test1', 'test2'].includes(val),
        },
      ]);
      const model = await settingsService.save(new TestSettingTarget());

      expect.assertions(2);

      try {
        await settingsService.updateSettings(model, [{ key: 'test.key', value: 3 }]);
      } catch (e) {
        expect(e instanceof FieldValidationException).toEqual(true);
        expect((<FieldValidationException>e).getFields()[0].property).toEqual('test.key');
      }
    });

    it('try update valid setting with validator', async () => {
      registerSettings([
        {
          key: 'test.key',
          type: String,
          validator: (val: any) => ['test1', 'test2'].includes(val),
        },
      ]);
      const model = await settingsService.save(new TestSettingTarget());

      const result = await settingsService.updateSettings(model, [
        { key: 'test.key', value: 'test2' },
      ]);

      expect(result).toEqual(true);
      expect(model.settings).toBeDefined();
      expect(model.settings?.test?.key).toEqual('test2');
    });
  });
});