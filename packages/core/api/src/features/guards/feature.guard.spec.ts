import { buildTest, createTestExecutionContext, LyvelyTestingModule } from '@/testing';
import { ExecutionContext } from '@nestjs/common';
import { Feature, FeatureGuard, FeaturesModule } from '../';
import { clearFeatures, registerFeatures } from '@lyvely/interface';
import { ProfileTestDataUtils } from '@/profiles';

describe('ProfileGuard', () => {
  let testingModule: LyvelyTestingModule;
  let featureGuard: FeatureGuard;
  //let featureRegistry: FeatureRegistry;
  let context: ExecutionContext;

  const TEST_KEY = 'feature-guard';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY).imports([FeaturesModule]).compile();
    featureGuard = testingModule.get<FeatureGuard>(FeatureGuard);
  });

  afterEach(async () => {
    clearFeatures();
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });
  describe('canActivate()', () => {
    it('enabled class level global feature', async () => {
      registerFeatures([
        { id: 'test', moduleId: 'test', title: 'Test', enabledByDefault: true, global: true },
      ]);

      @Feature('test')
      class TestController {}

      context = createTestExecutionContext({ class: TestController });
      const result = await featureGuard.canActivate(context);
      expect(result).toEqual(true);
    });

    it('disabled class level global feature', async () => {
      registerFeatures([
        { id: 'test', moduleId: 'test', title: 'Test', enabledByDefault: false, global: true },
      ]);

      @Feature('test')
      class TestController {}

      context = createTestExecutionContext({ class: TestController });
      const result = await featureGuard.canActivate(context);
      expect(result).toEqual(false);
    });

    it('enabled profile level feature', async () => {
      const { profile } = ProfileTestDataUtils.createDummyUserAndProfile(
        {},
        { enabledFeatures: ['test'] },
      );

      registerFeatures([{ id: 'test', moduleId: 'test', title: 'Test', installable: true }]);

      @Feature('test')
      class TestController {}

      context = createTestExecutionContext({ class: TestController, profile });
      const result = await featureGuard.canActivate(context);
      expect(result).toEqual(true);
    });

    it('disabled profile level feature', async () => {
      const { profile } = ProfileTestDataUtils.createDummyUserAndProfile(
        {},
        { disabledFeatures: ['test'] },
      );

      registerFeatures([
        { id: 'test', moduleId: 'test', title: 'Test', enabledByDefault: true, installable: true },
      ]);

      @Feature('test')
      class TestController {}

      context = createTestExecutionContext({ class: TestController, profile });
      const result = await featureGuard.canActivate(context);
      expect(result).toEqual(false);
    });

    it('multiple enabled features', async () => {
      const { profile } = ProfileTestDataUtils.createDummyUserAndProfile();

      registerFeatures([
        { id: 't1', moduleId: 'test', title: 'Test', enabledByDefault: true },
        { id: 't2', moduleId: 'test', title: 'Test2', enabledByDefault: true },
      ]);

      @Feature('t1', 't2')
      class TestController {}

      context = createTestExecutionContext({ class: TestController, profile });
      const result = await featureGuard.canActivate(context);
      expect(result).toEqual(true);
    });

    it('enabled and disabled features', async () => {
      const { profile } = ProfileTestDataUtils.createDummyUserAndProfile();

      registerFeatures([
        { id: 't1', moduleId: 'test', title: 'Test', enabledByDefault: true },
        { id: 't2', moduleId: 'test', title: 'Test2', enabledByDefault: false },
      ]);

      @Feature('t1', 't2')
      class TestController {}

      context = createTestExecutionContext({ class: TestController, profile });
      const result = await featureGuard.canActivate(context);
      expect(result).toEqual(false);
    });

    it('mixed global and profile features', async () => {
      const { profile } = ProfileTestDataUtils.createDummyUserAndProfile();

      registerFeatures([
        { id: 't1', moduleId: 'test', title: 'Test', enabledByDefault: true },
        { id: 't2', moduleId: 'test', title: 'Test2', enabledByDefault: true, global: true },
      ]);

      @Feature('t1', 't2')
      class TestController {}

      context = createTestExecutionContext({ class: TestController, profile });
      const result = await featureGuard.canActivate(context);
      expect(result).toEqual(true);
    });

    it('profile feature without profile context fails', async () => {
      registerFeatures([{ id: 't1', moduleId: 'test', title: 'Test', enabledByDefault: true }]);

      @Feature('t1')
      class TestController {}

      context = createTestExecutionContext({ class: TestController });
      const result = await featureGuard.canActivate(context);
      expect(result).toEqual(false);
    });

    it('enabled class level feature with disabled function level feature', async () => {
      const { profile } = ProfileTestDataUtils.createDummyUserAndProfile();
      registerFeatures([
        { id: 't1', moduleId: 'test', title: 'Test', enabledByDefault: true },
        { id: 't2', moduleId: 'test', title: 'Test2', enabledByDefault: false },
      ]);

      @Feature('t1')
      class TestController {
        @Feature('t2')
        test() {}
      }

      context = createTestExecutionContext({
        class: TestController,
        profile,
        handler: new TestController().test,
      });
      const result = await featureGuard.canActivate(context);
      expect(result).toEqual(false);
    });

    it('enabled class level feature with enabled function level feature', async () => {
      const { profile } = ProfileTestDataUtils.createDummyUserAndProfile();
      registerFeatures([
        { id: 't1', moduleId: 'test', title: 'Test', enabledByDefault: true },
        { id: 't2', moduleId: 'test', title: 'Test2', enabledByDefault: true },
      ]);

      @Feature('t1')
      class TestController {
        @Feature('t2')
        test() {}
      }

      context = createTestExecutionContext({
        class: TestController,
        profile,
        handler: new TestController().test,
      });
      const result = await featureGuard.canActivate(context);
      expect(result).toEqual(true);
    });
  });
});
